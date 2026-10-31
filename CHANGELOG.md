## [2.0.5](https://github.com/Mister-Hope/create-codepen/compare/v2.0.4...v2.0.5) (2026-10-31)

### Bug Fixes

- accept boolean true for open and preview options ([#552](https://github.com/Mister-Hope/create-codepen/issues/552)) ([528a67a](https://github.com/Mister-Hope/create-codepen/commit/528a67a87e012a3549318f0e0025c4575eabf293))
- add missing MIT license file ([#544](https://github.com/Mister-Hope/create-codepen/issues/544)) ([b410a49](https://github.com/Mister-Hope/create-codepen/commit/b410a49f5e74923577215b32ae2404429e2da1ea))
- clean up iframe accessibility attributes ([#555](https://github.com/Mister-Hope/create-codepen/issues/555)) ([8c3e9a5](https://github.com/Mister-Hope/create-codepen/commit/8c3e9a5290c6c48e0d292a7e8f7c920d2fcc6123))
- encode URL path segments and normalize empty user ([#545](https://github.com/Mister-Hope/create-codepen/issues/545)) ([3398a89](https://github.com/Mister-Hope/create-codepen/commit/3398a896f79a7216ff1671b205e8ac911de968ec))
- guard document containers and repair the demo selector ([#557](https://github.com/Mister-Hope/create-codepen/issues/557)) ([4f7a1a8](https://github.com/Mister-Hope/create-codepen/commit/4f7a1a820def3e4e21457e3ee942452c46b12a5c))
- ignore unknown data-lang values in prefill payload ([#547](https://github.com/Mister-Hope/create-codepen/issues/547)) ([dde2229](https://github.com/Mister-Hope/create-codepen/commit/dde2229f5a3102be4c8b08d657aed3b9872a06bb))
- keep iframe ids unique for repeated embeddings ([#550](https://github.com/Mister-Hope/create-codepen/issues/550)) ([a929b43](https://github.com/Mister-Hope/create-codepen/commit/a929b43aecd309a30ffda155e45e82720a12901e))
- keep internal options out of the prefill form ([#551](https://github.com/Mister-Hope/create-codepen/issues/551)) ([c6fc547](https://github.com/Mister-Hope/create-codepen/commit/c6fc5471ddd3085184e5173879cdd901e30c4161))
- make repeated renders replace the existing wrapper ([#548](https://github.com/Mister-Hope/create-codepen/issues/548)) ([f44392f](https://github.com/Mister-Hope/create-codepen/commit/f44392f9a041f4ce8c81d0f1477a7862a631807d))
- prefer the pen link matching the slug hash when reading the author ([#556](https://github.com/Mister-Hope/create-codepen/issues/556)) ([34e93a2](https://github.com/Mister-Hope/create-codepen/commit/34e93a2f3be7d8c384dabe7a7def8fc9192c5cb6))
- skip nullish and non-primitive query options ([#546](https://github.com/Mister-Hope/create-codepen/issues/546)) ([fe7e5bf](https://github.com/Mister-Hope/create-codepen/commit/fe7e5bf149236ef092b1036430f48c1a9fa630c1))

## [2.0.4](https://github.com/Mister-Hope/create-codepen/compare/v2.0.3...v2.0.4) (2026-08-06)

### Bug Fixes

- allow multiple loadCodePens during loading ([5a57e40](https://github.com/Mister-Hope/create-codepen/commit/5a57e404e458bd6c3153f8a7e7f64956a8566b92))
- avoid duplicate iframe ids ([dd61b13](https://github.com/Mister-Hope/create-codepen/commit/dd61b13438e4c5cd3d1c27f15d552413ff5144dd))
- clarify open option and url hygiene ([ec25a1a](https://github.com/Mister-Hope/create-codepen/commit/ec25a1aa73dd719579d589297b9e8fa2b1b13ab1))
- dedupe iframe ids for detached containers ([286bec3](https://github.com/Mister-Hope/create-codepen/commit/286bec3959f313be85280172cdf0fe4cfa474bc1))
- detect user from nested pen links ([b1e0999](https://github.com/Mister-Hope/create-codepen/commit/b1e09990223738a05c14ea755746736853d4125b))
- open pen in new window without selector ([55b2791](https://github.com/Mister-Hope/create-codepen/commit/55b2791d48cf93c5a910f92137752ef8fe003704))
- parse data-prefill percent signs safely ([384b380](https://github.com/Mister-Hope/create-codepen/commit/384b380bfc94786da0be608bd8bc36bddec2014d))
- register DOMContentLoaded listener once ([28d031f](https://github.com/Mister-Hope/create-codepen/commit/28d031f2066026ea2d73fc7aa7c4a7cd2af3496d))
- skip invalid containers and copy options ([48190e0](https://github.com/Mister-Hope/create-codepen/commit/48190e0810e560a0cdacff7f1ee9613970c1e897))
- use friendly iframe title fallback ([df02e6a](https://github.com/Mister-Hope/create-codepen/commit/df02e6aec407dc41010b53cf9d85b54db7c3b5f7))

## [2.0.3](https://github.com/Mister-Hope/create-codepen/compare/v2.0.2...v2.0.3) (2026-07-10)

## [2.0.2](https://github.com/Mister-Hope/create-codepen/compare/v2.0.1...v2.0.2) (2026-03-31)

### Features

- update ([8cd9f5f](https://github.com/Mister-Hope/create-codepen/commit/8cd9f5ff11b9bcae9a867979e6dbeb6559a0ed9e))

## [2.0.1](https://github.com/Mister-Hope/create-codepen/compare/v2.0.0...v2.0.1) (2026-01-29)

### ⚠ BREAKING CHANGES

- drop node 18

### Features

- drop node 18 ([91574e3](https://github.com/Mister-Hope/create-codepen/commit/91574e3f48ec881de4e2fc4ff3ece662cdf9aacd))

## [2.0.0](https://github.com/Mister-Hope/create-codepen/compare/v1.0.1...v2.0.0) (2024-05-21)

### Features

- remove cjs and deprecated options ([d7756b8](https://github.com/Mister-Hope/create-codepen/commit/d7756b8211602738ae186ed417df9af265599875))

## [1.0.1](https://github.com/Mister-Hope/create-codepen/compare/v1.0.0...v1.0.1) (2023-10-10)

## [1.0.0](https://github.com/Mister-Hope/create-codepen/compare/22bb46d3de6b4da77efe224da03853b4345450eb...v1.0.0) (2023-10-10)

### Features

- add new apis ([a33c6aa](https://github.com/Mister-Hope/create-codepen/commit/a33c6aaebcec3f15370ff318003ca2caff8ebbf7))
- drop node16 support ([9b52fc3](https://github.com/Mister-Hope/create-codepen/commit/9b52fc39494d16bc1412d9a70f8ff577f6fa88b0))
- export types ([c0f2bb1](https://github.com/Mister-Hope/create-codepen/commit/c0f2bb1f0b21ad1f8f2e7dfdc56457ae157484d8))
- init ([22bb46d](https://github.com/Mister-Hope/create-codepen/commit/22bb46d3de6b4da77efe224da03853b4345450eb))
- rebuild api ([cd09fb1](https://github.com/Mister-Hope/create-codepen/commit/cd09fb127f102d5052cfaf803dc69d9d6f192e10))
