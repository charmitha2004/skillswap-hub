"use strict";(()=>{var e={};e.id=744,e.ids=[744],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35900:e=>{e.exports=require("pg")},6113:e=>{e.exports=require("crypto")},57147:e=>{e.exports=require("fs")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},466:(e,t,n)=>{n.r(t),n.d(t,{originalPathname:()=>eg,patchFetch:()=>eE,requestAsyncStorage:()=>ef,routeModule:()=>eh,serverHooks:()=>em,staticGenerationAsyncStorage:()=>ep});var s,o,i,a,r,l,c,u,d,h,f,p,m={};n.r(m),n.d(m,{POST:()=>ed,runtime:()=>ea});var g=n(49303),E=n(88716),C=n(60670);(function(e){e.STRING="string",e.NUMBER="number",e.INTEGER="integer",e.BOOLEAN="boolean",e.ARRAY="array",e.OBJECT="object"})(s||(s={})),function(e){e.LANGUAGE_UNSPECIFIED="language_unspecified",e.PYTHON="python"}(o||(o={})),function(e){e.OUTCOME_UNSPECIFIED="outcome_unspecified",e.OUTCOME_OK="outcome_ok",e.OUTCOME_FAILED="outcome_failed",e.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded"}(i||(i={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let y=["user","model","function","system"];(function(e){e.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",e.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",e.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",e.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",e.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",e.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY"})(a||(a={})),function(e){e.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",e.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",e.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",e.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",e.BLOCK_NONE="BLOCK_NONE"}(r||(r={})),function(e){e.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",e.NEGLIGIBLE="NEGLIGIBLE",e.LOW="LOW",e.MEDIUM="MEDIUM",e.HIGH="HIGH"}(l||(l={})),function(e){e.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",e.SAFETY="SAFETY",e.OTHER="OTHER"}(c||(c={})),function(e){e.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",e.STOP="STOP",e.MAX_TOKENS="MAX_TOKENS",e.SAFETY="SAFETY",e.RECITATION="RECITATION",e.LANGUAGE="LANGUAGE",e.BLOCKLIST="BLOCKLIST",e.PROHIBITED_CONTENT="PROHIBITED_CONTENT",e.SPII="SPII",e.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",e.OTHER="OTHER"}(u||(u={})),function(e){e.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",e.RETRIEVAL_QUERY="RETRIEVAL_QUERY",e.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",e.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",e.CLASSIFICATION="CLASSIFICATION",e.CLUSTERING="CLUSTERING"}(d||(d={})),function(e){e.MODE_UNSPECIFIED="MODE_UNSPECIFIED",e.AUTO="AUTO",e.ANY="ANY",e.NONE="NONE"}(h||(h={})),function(e){e.MODE_UNSPECIFIED="MODE_UNSPECIFIED",e.MODE_DYNAMIC="MODE_DYNAMIC"}(f||(f={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v extends Error{constructor(e){super(`[GoogleGenerativeAI Error]: ${e}`)}}class O extends v{constructor(e,t){super(e),this.response=t}}class T extends v{constructor(e,t,n,s){super(e),this.status=t,this.statusText=n,this.errorDetails=s}}class I extends v{}class w extends v{}!function(e){e.GENERATE_CONTENT="generateContent",e.STREAM_GENERATE_CONTENT="streamGenerateContent",e.COUNT_TOKENS="countTokens",e.EMBED_CONTENT="embedContent",e.BATCH_EMBED_CONTENTS="batchEmbedContents"}(p||(p={}));class S{constructor(e,t,n,s,o){this.model=e,this.task=t,this.apiKey=n,this.stream=s,this.requestOptions=o}toString(){var e,t;let n=(null===(e=this.requestOptions)||void 0===e?void 0:e.apiVersion)||"v1beta",s=(null===(t=this.requestOptions)||void 0===t?void 0:t.baseUrl)||"https://generativelanguage.googleapis.com",o=`${s}/${n}/${this.model}:${this.task}`;return this.stream&&(o+="?alt=sse"),o}}async function R(e){var t;let n=new Headers;n.append("Content-Type","application/json"),n.append("x-goog-api-client",function(e){let t=[];return(null==e?void 0:e.apiClient)&&t.push(e.apiClient),t.push("genai-js/0.24.1"),t.join(" ")}(e.requestOptions)),n.append("x-goog-api-key",e.apiKey);let s=null===(t=e.requestOptions)||void 0===t?void 0:t.customHeaders;if(s){if(!(s instanceof Headers))try{s=new Headers(s)}catch(e){throw new I(`unable to convert customHeaders value ${JSON.stringify(s)} to Headers: ${e.message}`)}for(let[e,t]of s.entries()){if("x-goog-api-key"===e)throw new I(`Cannot set reserved header name ${e}`);if("x-goog-api-client"===e)throw new I(`Header name ${e} can only be set using the apiClient field`);n.append(e,t)}}return n}async function b(e,t,n,s,o,i){let a=new S(e,t,n,s,i);return{url:a.toString(),fetchOptions:Object.assign(Object.assign({},function(e){let t={};if((null==e?void 0:e.signal)!==void 0||(null==e?void 0:e.timeout)>=0){let n=new AbortController;(null==e?void 0:e.timeout)>=0&&setTimeout(()=>n.abort(),e.timeout),(null==e?void 0:e.signal)&&e.signal.addEventListener("abort",()=>{n.abort()}),t.signal=n.signal}return t}(i)),{method:"POST",headers:await R(a),body:o})}}async function _(e,t,n,s,o,i={},a=fetch){let{url:r,fetchOptions:l}=await b(e,t,n,s,o,i);return A(r,l,a)}async function A(e,t,n=fetch){let s;try{s=await n(e,t)}catch(t){(function(e,t){let n=e;throw"AbortError"===n.name?(n=new w(`Request aborted when fetching ${t.toString()}: ${e.message}`)).stack=e.stack:e instanceof T||e instanceof I||((n=new v(`Error fetching from ${t.toString()}: ${e.message}`)).stack=e.stack),n})(t,e)}return s.ok||await N(s,e),s}async function N(e,t){let n,s="";try{let t=await e.json();s=t.error.message,t.error.details&&(s+=` ${JSON.stringify(t.error.details)}`,n=t.error.details)}catch(e){}throw new T(`Error fetching from ${t.toString()}: [${e.status} ${e.statusText}] ${s}`,e.status,e.statusText,n)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function k(e){return e.text=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),L(e.candidates[0]))throw new O(`${D(e)}`,e);return function(e){var t,n,s,o;let i=[];if(null===(n=null===(t=e.candidates)||void 0===t?void 0:t[0].content)||void 0===n?void 0:n.parts)for(let t of null===(o=null===(s=e.candidates)||void 0===s?void 0:s[0].content)||void 0===o?void 0:o.parts)t.text&&i.push(t.text),t.executableCode&&i.push("\n```"+t.executableCode.language+"\n"+t.executableCode.code+"\n```\n"),t.codeExecutionResult&&i.push("\n```\n"+t.codeExecutionResult.output+"\n```\n");return i.length>0?i.join(""):""}(e)}if(e.promptFeedback)throw new O(`Text not available. ${D(e)}`,e);return""},e.functionCall=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),L(e.candidates[0]))throw new O(`${D(e)}`,e);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),x(e)[0]}if(e.promptFeedback)throw new O(`Function call not available. ${D(e)}`,e)},e.functionCalls=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),L(e.candidates[0]))throw new O(`${D(e)}`,e);return x(e)}if(e.promptFeedback)throw new O(`Function call not available. ${D(e)}`,e)},e}function x(e){var t,n,s,o;let i=[];if(null===(n=null===(t=e.candidates)||void 0===t?void 0:t[0].content)||void 0===n?void 0:n.parts)for(let t of null===(o=null===(s=e.candidates)||void 0===s?void 0:s[0].content)||void 0===o?void 0:o.parts)t.functionCall&&i.push(t.functionCall);return i.length>0?i:void 0}let M=[u.RECITATION,u.SAFETY,u.LANGUAGE];function L(e){return!!e.finishReason&&M.includes(e.finishReason)}function D(e){var t,n,s;let o="";if((!e.candidates||0===e.candidates.length)&&e.promptFeedback)o+="Response was blocked",(null===(t=e.promptFeedback)||void 0===t?void 0:t.blockReason)&&(o+=` due to ${e.promptFeedback.blockReason}`),(null===(n=e.promptFeedback)||void 0===n?void 0:n.blockReasonMessage)&&(o+=`: ${e.promptFeedback.blockReasonMessage}`);else if(null===(s=e.candidates)||void 0===s?void 0:s[0]){let t=e.candidates[0];L(t)&&(o+=`Candidate was blocked due to ${t.finishReason}`,t.finishMessage&&(o+=`: ${t.finishMessage}`))}return o}function U(e){return this instanceof U?(this.v=e,this):new U(e)}"function"==typeof SuppressedError&&SuppressedError;/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let P=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function H(e){let t=[],n=e.getReader();for(;;){let{done:e,value:s}=await n.read();if(e)return k(function(e){let t=e[e.length-1],n={promptFeedback:null==t?void 0:t.promptFeedback};for(let t of e){if(t.candidates){let e=0;for(let s of t.candidates)if(n.candidates||(n.candidates=[]),n.candidates[e]||(n.candidates[e]={index:e}),n.candidates[e].citationMetadata=s.citationMetadata,n.candidates[e].groundingMetadata=s.groundingMetadata,n.candidates[e].finishReason=s.finishReason,n.candidates[e].finishMessage=s.finishMessage,n.candidates[e].safetyRatings=s.safetyRatings,s.content&&s.content.parts){n.candidates[e].content||(n.candidates[e].content={role:s.content.role||"user",parts:[]});let t={};for(let o of s.content.parts)o.text&&(t.text=o.text),o.functionCall&&(t.functionCall=o.functionCall),o.executableCode&&(t.executableCode=o.executableCode),o.codeExecutionResult&&(t.codeExecutionResult=o.codeExecutionResult),0===Object.keys(t).length&&(t.text=""),n.candidates[e].content.parts.push(t)}e++}t.usageMetadata&&(n.usageMetadata=t.usageMetadata)}return n}(t));t.push(s)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function F(e,t,n,s){return function(e){let[t,n]=(function(e){let t=e.getReader();return new ReadableStream({start(e){let n="";return function s(){return t.read().then(({value:t,done:o})=>{let i;if(o){if(n.trim()){e.error(new v("Failed to parse stream"));return}e.close();return}let a=(n+=t).match(P);for(;a;){try{i=JSON.parse(a[1])}catch(t){e.error(new v(`Error parsing JSON response: "${a[1]}"`));return}e.enqueue(i),a=(n=n.substring(a[0].length)).match(P)}return s()}).catch(e=>{let t=e;throw t.stack=e.stack,t="AbortError"===t.name?new w("Request aborted when reading from the stream"):new v("Error reading from the stream")})}()}})})(e.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0}))).tee();return{stream:function(e){return function(e,t,n){if(!Symbol.asyncIterator)throw TypeError("Symbol.asyncIterator is not defined.");var s,o=n.apply(e,t||[]),i=[];return s={},a("next"),a("throw"),a("return"),s[Symbol.asyncIterator]=function(){return this},s;function a(e){o[e]&&(s[e]=function(t){return new Promise(function(n,s){i.push([e,t,n,s])>1||r(e,t)})})}function r(e,t){try{var n;(n=o[e](t)).value instanceof U?Promise.resolve(n.value.v).then(l,c):u(i[0][2],n)}catch(e){u(i[0][3],e)}}function l(e){r("next",e)}function c(e){r("throw",e)}function u(e,t){e(t),i.shift(),i.length&&r(i[0][0],i[0][1])}}(this,arguments,function*(){let t=e.getReader();for(;;){let{value:e,done:n}=yield U(t.read());if(n)break;yield yield U(k(e))}})}(t),response:H(n)}}(await _(t,p.STREAM_GENERATE_CONTENT,e,!0,JSON.stringify(n),s))}async function j(e,t,n,s){let o=await _(t,p.GENERATE_CONTENT,e,!1,JSON.stringify(n),s);return{response:k(await o.json())}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $(e){if(null!=e){if("string"==typeof e)return{role:"system",parts:[{text:e}]};if(e.text)return{role:"system",parts:[e]};if(e.parts)return e.role?e:{role:"system",parts:e.parts}}}function G(e){let t=[];if("string"==typeof e)t=[{text:e}];else for(let n of e)"string"==typeof n?t.push({text:n}):t.push(n);return function(e){let t={role:"user",parts:[]},n={role:"function",parts:[]},s=!1,o=!1;for(let i of e)"functionResponse"in i?(n.parts.push(i),o=!0):(t.parts.push(i),s=!0);if(s&&o)throw new v("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!s&&!o)throw new v("No content is provided for sending chat message.");return s?t:n}(t)}function q(e){let t;return t=e.contents?e:{contents:[G(e)]},e.systemInstruction&&(t.systemInstruction=$(e.systemInstruction)),t}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Y=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],B={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]};function K(e){var t;if(void 0===e.candidates||0===e.candidates.length)return!1;let n=null===(t=e.candidates[0])||void 0===t?void 0:t.content;if(void 0===n||void 0===n.parts||0===n.parts.length)return!1;for(let e of n.parts)if(void 0===e||0===Object.keys(e).length||void 0!==e.text&&""===e.text)return!1;return!0}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let W="SILENT_ERROR";class J{constructor(e,t,n,s={}){this.model=t,this.params=n,this._requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=e,(null==n?void 0:n.history)&&(function(e){let t=!1;for(let n of e){let{role:e,parts:s}=n;if(!t&&"user"!==e)throw new v(`First content should be with role 'user', got ${e}`);if(!y.includes(e))throw new v(`Each item should include role field. Got ${e} but valid roles are: ${JSON.stringify(y)}`);if(!Array.isArray(s))throw new v("Content should have 'parts' property with an array of Parts");if(0===s.length)throw new v("Each Content should have at least one part");let o={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(let e of s)for(let t of Y)t in e&&(o[t]+=1);let i=B[e];for(let t of Y)if(!i.includes(t)&&o[t]>0)throw new v(`Content with role '${e}' can't contain '${t}' part`);t=!0}}(n.history),this._history=n.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(e,t={}){var n,s,o,i,a,r;let l;await this._sendPromise;let c=G(e),u={safetySettings:null===(n=this.params)||void 0===n?void 0:n.safetySettings,generationConfig:null===(s=this.params)||void 0===s?void 0:s.generationConfig,tools:null===(o=this.params)||void 0===o?void 0:o.tools,toolConfig:null===(i=this.params)||void 0===i?void 0:i.toolConfig,systemInstruction:null===(a=this.params)||void 0===a?void 0:a.systemInstruction,cachedContent:null===(r=this.params)||void 0===r?void 0:r.cachedContent,contents:[...this._history,c]},d=Object.assign(Object.assign({},this._requestOptions),t);return this._sendPromise=this._sendPromise.then(()=>j(this._apiKey,this.model,u,d)).then(e=>{var t;if(K(e.response)){this._history.push(c);let n=Object.assign({parts:[],role:"model"},null===(t=e.response.candidates)||void 0===t?void 0:t[0].content);this._history.push(n)}else{let t=D(e.response);t&&console.warn(`sendMessage() was unsuccessful. ${t}. Inspect response object for details.`)}l=e}).catch(e=>{throw this._sendPromise=Promise.resolve(),e}),await this._sendPromise,l}async sendMessageStream(e,t={}){var n,s,o,i,a,r;await this._sendPromise;let l=G(e),c={safetySettings:null===(n=this.params)||void 0===n?void 0:n.safetySettings,generationConfig:null===(s=this.params)||void 0===s?void 0:s.generationConfig,tools:null===(o=this.params)||void 0===o?void 0:o.tools,toolConfig:null===(i=this.params)||void 0===i?void 0:i.toolConfig,systemInstruction:null===(a=this.params)||void 0===a?void 0:a.systemInstruction,cachedContent:null===(r=this.params)||void 0===r?void 0:r.cachedContent,contents:[...this._history,l]},u=Object.assign(Object.assign({},this._requestOptions),t),d=F(this._apiKey,this.model,c,u);return this._sendPromise=this._sendPromise.then(()=>d).catch(e=>{throw Error(W)}).then(e=>e.response).then(e=>{if(K(e)){this._history.push(l);let t=Object.assign({},e.candidates[0].content);t.role||(t.role="model"),this._history.push(t)}else{let t=D(e);t&&console.warn(`sendMessageStream() was unsuccessful. ${t}. Inspect response object for details.`)}}).catch(e=>{e.message!==W&&console.error(e)}),d}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function V(e,t,n,s){return(await _(t,p.COUNT_TOKENS,e,!1,JSON.stringify(n),s)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function z(e,t,n,s){return(await _(t,p.EMBED_CONTENT,e,!1,JSON.stringify(n),s)).json()}async function X(e,t,n,s){let o=n.requests.map(e=>Object.assign(Object.assign({},e),{model:t}));return(await _(t,p.BATCH_EMBED_CONTENTS,e,!1,JSON.stringify({requests:o}),s)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q{constructor(e,t,n={}){this.apiKey=e,this._requestOptions=n,t.model.includes("/")?this.model=t.model:this.model=`models/${t.model}`,this.generationConfig=t.generationConfig||{},this.safetySettings=t.safetySettings||[],this.tools=t.tools,this.toolConfig=t.toolConfig,this.systemInstruction=$(t.systemInstruction),this.cachedContent=t.cachedContent}async generateContent(e,t={}){var n;let s=q(e),o=Object.assign(Object.assign({},this._requestOptions),t);return j(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(n=this.cachedContent)||void 0===n?void 0:n.name},s),o)}async generateContentStream(e,t={}){var n;let s=q(e),o=Object.assign(Object.assign({},this._requestOptions),t);return F(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(n=this.cachedContent)||void 0===n?void 0:n.name},s),o)}startChat(e){var t;return new J(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(t=this.cachedContent)||void 0===t?void 0:t.name},e),this._requestOptions)}async countTokens(e,t={}){let n=function(e,t){var n;let s={model:null==t?void 0:t.model,generationConfig:null==t?void 0:t.generationConfig,safetySettings:null==t?void 0:t.safetySettings,tools:null==t?void 0:t.tools,toolConfig:null==t?void 0:t.toolConfig,systemInstruction:null==t?void 0:t.systemInstruction,cachedContent:null===(n=null==t?void 0:t.cachedContent)||void 0===n?void 0:n.name,contents:[]},o=null!=e.generateContentRequest;if(e.contents){if(o)throw new I("CountTokensRequest must have one of contents or generateContentRequest, not both.");s.contents=e.contents}else if(o)s=Object.assign(Object.assign({},s),e.generateContentRequest);else{let t=G(e);s.contents=[t]}return{generateContentRequest:s}}(e,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent}),s=Object.assign(Object.assign({},this._requestOptions),t);return V(this.apiKey,this.model,n,s)}async embedContent(e,t={}){let n="string"==typeof e||Array.isArray(e)?{content:G(e)}:e,s=Object.assign(Object.assign({},this._requestOptions),t);return z(this.apiKey,this.model,n,s)}async batchEmbedContents(e,t={}){let n=Object.assign(Object.assign({},this._requestOptions),t);return X(this.apiKey,this.model,e,n)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z{constructor(e){this.apiKey=e}getGenerativeModel(e,t){if(!e.model)throw new v("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new Q(this.apiKey,e,t)}getGenerativeModelFromCachedContent(e,t,n){if(!e.name)throw new I("Cached content must contain a `name` field.");if(!e.model)throw new I("Cached content must contain a `model` field.");for(let n of["model","systemInstruction"])if((null==t?void 0:t[n])&&e[n]&&(null==t?void 0:t[n])!==e[n]){if("model"===n&&(t.model.startsWith("models/")?t.model.replace("models/",""):t.model)===(e.model.startsWith("models/")?e.model.replace("models/",""):e.model))continue;throw new I(`Different value for "${n}" specified in modelParams (${t[n]}) and cachedContent (${e[n]})`)}let s=Object.assign(Object.assign({},t),{model:e.model,tools:e.tools,toolConfig:e.toolConfig,systemInstruction:e.systemInstruction,cachedContent:e});return new Q(this.apiKey,s,n)}}var ee=n(87070),et=n(71017),en=n.n(et);let es=["Platform Rule: To schedule a meeting on SwapSkill Hub, open a matched user profile, choose Request Session, select a time slot, add a short goal for the session, and wait for the other user to accept.","Platform Rule: Skill swap sessions should be focused on one clear learning outcome. Users can reschedule from the Requests page if both participants agree.","Platform Rule: The leaderboard rewards helpful teaching, completed sessions, positive feedback, and consistent participation. Canceled or missed sessions do not add points.","Platform Rule: Users should keep conversations respectful, avoid sharing private credentials, and use SwapSkill Hub only for learning, mentoring, and skill exchange.","User Profile: Kabir Singh is an expert in Docker and Node.js. He can help users containerize full-stack apps, debug backend services, and prepare Dockerfiles.","User Profile: Aarav Mehta teaches PostgreSQL. He helps with schema design, SQL joins, indexing basics, query debugging, and database setup.","User Profile: Maya Iyer teaches Figma prototyping. She can help with wireframes, clickable prototypes, component variants, and design handoff workflows.","User Profile: Charmitha is interested in improving full-stack development skills and likes practical project-based learning sessions.","FAQ: If sign in fails, check that the backend server is running, verify the API URL, and confirm that the email and password are correct.","FAQ: If matches do not appear, complete your profile with skills you can teach, skills you want to learn, and your preferred availability.","FAQ: If a request is stuck pending, the other user has not accepted yet. You can wait, cancel the request, or message another matching user.","FAQ: If the app feels out of date, refresh the page and confirm that both the frontend and backend development servers are running."],eo=new Set(["a","an","and","are","as","at","be","can","do","for","from","how","i","in","is","it","me","my","of","on","or","the","to","what","with","you"]);function ei(e){return e.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(e=>e.length>1&&!eo.has(e))}n(16636).config({path:en().resolve(process.cwd(),"..",".env"),override:!0,quiet:!0});let ea="nodejs",{Pool:er}=n(35900);function el(){if(!globalThis.skillswapChatDbPool){let e=!!process.env.DATABASE_URL,t=new er({connectionString:process.env.DATABASE_URL,user:e?void 0:process.env.DB_USER||"postgres",host:e?void 0:process.env.DB_HOST||"localhost",database:e?void 0:process.env.DB_NAME||"skillswap",password:e?void 0:process.env.DB_PASSWORD||"postgres",port:e?void 0:Number(process.env.DB_PORT||5432),ssl:"true"===process.env.DB_SSL?{rejectUnauthorized:!1}:void 0});t.on?.("error",e=>{console.error("Unexpected database pool error",e)}),globalThis.skillswapChatDbPool=t}return globalThis.skillswapChatDbPool}async function ec(){try{let e=el(),[t,n]=await Promise.all([e.query("SELECT COUNT(*)::int AS total FROM users"),e.query(`
        SELECT DISTINCT skill
        FROM (
          SELECT unnest(teach_skills) AS skill FROM users
          UNION
          SELECT unnest(learn_skills) AS skill FROM users
        ) platform_skills
        WHERE NULLIF(trim(skill), '') IS NOT NULL
        ORDER BY skill ASC
        LIMIT 50
      `)]),s=t.rows[0]?.total??0,o=n.rows.map(e=>e.skill).filter(Boolean),i=o.length?o.join(", "):"none listed yet";return{dynamicContext:`CURRENT PLATFORM DATA: There are currently ${s} registered users. The available skills on the platform include: ${i}.`,liveUserCount:s,liveSkillsArray:o}}catch(e){return console.error("Unable to load dynamic platform context",e),{dynamicContext:"CURRENT PLATFORM DATA: Live platform data is currently unavailable from the database.",liveUserCount:0,liveSkillsArray:[]}}}async function eu({skill:e="",status:t=""}){try{let n=el(),s=e.trim(),o=t.toLowerCase().includes("active");return(s?await n.query(`SELECT id, name, department, teach_skills, learn_skills
           FROM users
           WHERE EXISTS (SELECT 1 FROM unnest(teach_skills) skill WHERE skill ILIKE $1)
              OR EXISTS (SELECT 1 FROM unnest(learn_skills) skill WHERE skill ILIKE $1)
           ORDER BY name ASC
           LIMIT 6`,[`%${s}%`]):await n.query(`SELECT id, name, department, teach_skills, learn_skills
           FROM users
           ORDER BY updated_at DESC, name ASC
           LIMIT 6`)).rows.map(e=>({id:e.id,name:e.name,role:o?`${e.department} member`:e.department,skills:Array.from(new Set([...e.teach_skills||[],...e.learn_skills||[]])).slice(0,8)}))}catch(e){return console.error("Unable to find users by skill",e),[]}}async function ed(e){try{let t=await e.json(),n=Array.isArray(t.history)?t.history:[],s="string"==typeof t.message?t.message.trim():"",o="string"==typeof t.file&&t.file.length>0?t.file:null,i="string"==typeof t.mimeType&&t.mimeType.length>0?t.mimeType:null;if(!s&&!o)return ee.NextResponse.json({error:"A message or file attachment is required."},{status:400});if(!o&&/^(hi|hello|hey|hii|helo|namaste)\b[!.?\s]*$/i.test(s))return new Response("Hi! Ask me about skills, users, requests, or a topic you want to learn.",{headers:{"Content-Type":"text/plain; charset=utf-8"}});let{dynamicContext:a,liveSkillsArray:r,liveUserCount:l}=await ec(),c=o?null:function(e){let t=e.toLowerCase();if(/\b(active|available|registered)\s+users?\b/.test(t))return{status:"active"};let n=t.match(/\b(?:who knows|who teaches|show me|find|anyone knows|users? with)\s+([a-z0-9+#.\s-]+?)(?:\?|$)/i)||t.match(/\b([a-z0-9+#.-]+)\s+(?:users|mentors|teachers|experts)\b/i);if(!n?.[1])return null;let s=n[1].replace(/\b(active|available|users|mentors|teachers|experts|skill|skills|for|me)\b/gi,"").trim();return s?{skill:s}:null}(s);if(c){let e=await eu(c),t=c.skill?` for ${c.skill}`:"";return ee.NextResponse.json({type:"tool-invocation",toolName:"findUsersBySkill",text:e.length?`Found ${e.length} user${1===e.length?"":"s"}${t}.`:`No users found${t}.`,args:c,users:e})}let u=process.env.GEMINI_API_KEY;if(!u)return new Response("I can answer platform stats and user searches, but Gemini is not configured for tutoring yet.",{headers:{"Content-Type":"text/plain; charset=utf-8"}});let d=function(e,t=3){let n=ei(e);if(0===n.length)return es.slice(0,t);let s=es.map((e,t)=>{let s=ei(e),o=new Set(s);return{chunk:e,index:t,score:n.reduce((e,t)=>o.has(t)?e+3:s.some(e=>e.includes(t)||t.includes(e))?e+1:e,0)}}).filter(e=>e.score>0).sort((e,t)=>t.score-e.score||e.index-t.index).slice(0,t).map(e=>e.chunk);return s.length>0?s:es.slice(0,t)}(s||"uploaded file assistance"),h=d.length?`Relevant platform details:
${d.map((e,t)=>`${t+1}. ${e}`).join("\n")}`:"",f=`You are SwapSkill Copilot, the official assistant for SwapSkill Hub.

You have strict operational rules you MUST follow:

RULE 1: CONCISENESS. You are strictly forbidden from writing paragraphs. Your answers must be extremely short, direct, and conversational. Use a maximum of 1 to 3 short sentences. If listing things, use brief bullet points.

RULE 2: APPROVED TOPICS. You may ONLY answer questions related to:
A) The SwapSkill Hub platform (how to use it, active users, available skills, making requests).
B) Educational, technical, or skill-based subjects (e.g., 'What is Java', 'How does React work', 'Explain UI design').

RULE 3: STRICT REJECTION. If a user asks about ANYTHING outside of the approved topics in Rule 2 (e.g., weather, politics, recipes, general non-educational chat, writing essays), you must immediately reject the prompt. Reply exactly with: 'I am the SwapSkill Hub assistant. That topic is not valid here. I can only help with platform features and educational subjects.' Do not apologize or explain further.

RULE 4: CONTEXT USAGE. Always prioritize using the injected database context to answer questions about active users and platform stats.

RULE 5: VISION & IMAGE UPLOADS. If the user uploads an image, you must first determine if it is related to an educational subject, a technical skill, or the SwapSkill Hub platform.

IF YES: Analyze the image and help the user learn from it or solve their problem.

IF NO (e.g., a random selfie, a picture of a pet, or unrelated objects): You MUST refuse to analyze it. Reply exactly with: 'I can only analyze images related to educational subjects or platform skills. Please upload something related to your learning goals.'

${a}

${h}`,p=new Z(u).getGenerativeModel({model:process.env.GEMINI_MODEL||"gemini-1.5-pro",systemInstruction:f}),m=[{text:s||"Please analyze this uploaded file and explain how it relates to SwapSkill Hub."}];if(o&&i){if(!i.startsWith("image/"))return new Response("I can only analyze images related to educational subjects or platform skills. Please upload something related to your learning goals.",{headers:{"Content-Type":"text/plain; charset=utf-8"}});m.push({inlineData:{data:o,mimeType:i}})}let g=[...function(e=[]){let t=e.filter(e=>"string"==typeof e.text&&e.text.trim().length>0).map(e=>({role:"gemini"===e.sender?"model":"user",parts:[{text:e.text?.trim()||""}]})).filter(e=>e.parts[0].text.length>0);for(;t.length>0&&"user"!==t[0].role;)t.shift();return t}(n),{role:"user",parts:m}];if(!o&&/\b(what|which|show|list).*\b(skills|available skills)\b/i.test(s)){let e=r.length?r.join(", "):"No skills are listed yet.";return new Response(`Available skills: ${e}`,{headers:{"Content-Type":"text/plain; charset=utf-8"}})}if(!o&&/\b(how many|count|number of|active|registered).*\b(users|members)\b/i.test(s))return new Response(`There are currently ${l} registered users.`,{headers:{"Content-Type":"text/plain; charset=utf-8"}});let E=await p.generateContentStream({contents:g,generationConfig:{temperature:.2,maxOutputTokens:200}}),C="",y=new ReadableStream({async start(e){try{for await(let t of E.stream){let n=t.text().trim(),s=n.startsWith(C)?n.slice(C.length):n;s&&e.enqueue(s),C=n}e.close()}catch(t){e.enqueue("I am the SwapSkill Hub assistant. That topic is not valid here. I can only help with platform features and educational subjects."),e.close()}}});return new Response(y,{headers:{"Content-Type":"text/plain; charset=utf-8"}})}catch(e){return console.error("Unable to process chat request",e),new Response("I hit a chat service issue. Try asking about skills, users, requests, or a learning topic again.",{headers:{"Content-Type":"text/plain; charset=utf-8"}})}}let eh=new g.AppRouteRouteModule({definition:{kind:E.x.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"C:\\Users\\donth\\OneDrive\\Desktop\\skillswap-hub\\frontend\\app\\api\\chat\\route.ts",nextConfigOutput:"export",userland:m}),{requestAsyncStorage:ef,staticGenerationAsyncStorage:ep,serverHooks:em}=eh,eg="/api/chat/route";function eE(){return(0,C.patchFetch)({serverHooks:em,staticGenerationAsyncStorage:ep})}}};var t=require("../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),s=t.X(0,[948,13,972],()=>n(466));module.exports=s})();