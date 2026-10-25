import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createServer} from 'vite'
import React from 'react'
test('language selection persists safely, updates HTML language and retains the same child subtree',async()=>{
 let value,previous,effect
 globalThis.__languageHooks={useState(initial){if(value===undefined)value=typeof initial==='function'?initial():initial;return[value,next=>{value=next}]},useEffect(fn,[language]){if(previous!==language){effect=fn;previous=language}}}
 const saved=new Map();globalThis.window={navigator:{language:'de-DE'},localStorage:{getItem:key=>saved.get(key)??null,setItem:(key,val)=>saved.set(key,val)}};globalThis.document={documentElement:{lang:'en'}}
 const server=await createServer({configFile:'vite.config.ts',server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',plugins:[{name:'language-hooks',enforce:'pre',transform(source,id){if(id.endsWith('/LanguageContext.tsx'))return source.replace("import { createContext, useContext, useEffect, useState } from 'react'", "import { createContext, useContext } from 'react'\nconst {useEffect,useState}=globalThis.__languageHooks")}}]})
 try {
  const {LanguageProvider,languageStorageKey}=await server.ssrLoadModule('/src/i18n/LanguageContext.tsx')
  const child=React.createElement('div',{id:'same-stateful-subtree'})
  let root=LanguageProvider({children:child});effect();assert.equal(root.props.value.language,'en');assert.equal(document.documentElement.lang,'en')
  root.props.value.setLanguage('de');root=LanguageProvider({children:child});effect();assert.equal(document.documentElement.lang,'de');assert.equal(saved.get(languageStorageKey),'de');assert.equal(root.props.children,child)
  value=undefined;previous=undefined;root=LanguageProvider({children:child});effect();assert.equal(root.props.value.language,'de','Stored selection survives a refresh')
  root.props.value.setLanguage('en');root=LanguageProvider({children:child});effect();assert.equal(document.documentElement.lang,'en');assert.equal(saved.get(languageStorageKey),'en');assert.equal(root.props.children,child)
  window.localStorage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};value=undefined;previous=undefined;root=LanguageProvider({children:child});assert.doesNotThrow(()=>effect());assert.equal(root.props.value.language,'en')
 }finally{await server.close();delete globalThis.__languageHooks;delete globalThis.window;delete globalThis.document}
})
