/**
 * SHA-256 of every image the product hands a workspace in place of a logo of
 * its own. A logo whose bytes match one of these is not the firm's, and
 * /powered-by draws the initial instead of it.
 *
 * Matched by content rather than by URL because the URL can't tell them apart:
 * the same Assembly mark turns up under the shared `brand-logos` path and as a
 * copy inside a workspace's own folder, and a path check passes the copy.
 *
 * Where they come from: at portal setup the product looks up branding for the
 * signup email's domain, two ways, so a workspace set up with one of our own
 * addresses (assembly.com, copilot.com, copilot.app, joinportal.com) carries
 * our mark without anyone uploading it.
 *
 * - Brand customization (backend/lib/services/brand_customization) copies the
 *   brand API's images, unmodified, into the workspace's own folder as
 *   `<portal>/images/assets/iconUrl/brand-icon.png` and
 *   `.../logoUrl/brand-logo.png`. This is the common case, and the one a path
 *   check can't catch.
 * - The logo finder (backend/lib/services/logofinder) stores logo.dev's result
 *   at the shared `public/images/brand-logos/<domain>-<size>.png`, at 512, 60
 *   and 24px, each at 1x and 2x.
 *
 * The other stand-in, the dummyimage.com letter a workspace gets when the
 * finder comes up empty, needs no entry: it is not on a workspace logo host,
 * so the lookup never fetches it.
 *
 * To add one, hash the file as it is served:
 *   curl -s <url> | shasum -a 256
 */
export const DEFAULT_LOGO_HASHES: ReadonlySet<string> = new Set([
  // Brand customization's copies, byte-identical in every workspace checked
  "2665b6e6609cd2b1a7c2275b4bfba96e368097c4cd3e587a3fdb97a189e59ce5", // brand-icon.png, 300x300
  "667f35bba23f60b954ef7e8043f61785a1c75dab3b1dfec685604605b634dc4c", // brand-logo.png, 900x180 wordmark
  // public/images/brand-logos/assembly-com-*.png
  "351365ee1905debead7a2ef0571b03242590ad7addd7f47a359bb10f7d473d9b", // 512@2x
  "fbdffbad36b35e29ba6aa704f74c46578171404d705bfead7d334f20b0b6c45c", // 512
  "bc3ff5e7901baeca844c3ffa191b5945e874d86aa7b7b2db843a95e971e2166c", // 60@2x
  "3e7b6308b61b3f9ad08fe805d2495676011528d99931e812e4519233a770163a", // 60
  "ca36bc58b6d03b43d5fc6c2bee3d7c1d89ad5a882e2eef22dfce497752a7dc66", // 24@2x
  "d24748420945b7310a7ff60ae89a61bc6ea29ec2b5c123996a656cf6e6c8f2b7", // 24
  // public/images/brand-logos/copilot-com-*.png, the mark before the rename
  "705d3cb6b90d12d8904715c1c695903e8b5e9f6b6a9b74d11d32b562a3ffb611", // 512@2x
  "b506bc2b6c2a060902e31506bfd9dd3173fac559a9f76dc12191e8ad5528bd98", // 512
  "5e5b8ca688051ab8564342a76435a66060dac55b601d6d6fbdc13903b1c6fd46", // 60@2x
  "955e16709ab98d74b302f63b25ff8f7b5ac1f40d9f1d30c9134d5c7c1bebdef3", // 60
  "bd0b2603ba359580dd530cd5e03b4814f6dc8651e3ca1e6b8782bda7baffab4a", // 24@2x
  "503587e610448771887a55ac1d3515a53c660ffad03773c13d07050d85e25d70", // 24
  // public/images/brand-logos/copilot-app-*.png
  "2f8450d7ad023779ffca1bb79d12597fff5a9410cc4a535526f9063d6e1572b2", // 512@2x
  "c9107cfa7d4ff628227f64efd18b35d09e2dc1816f9a9087fdf55d6871a07c7c", // 512
  "5d4c66a6ad3b664f5e75507c1787cc4e174db5077478dc1ec634a6f588e2efe2", // 60@2x
  "9b7a6f7f06057d20a2cd965267d45a06754c4e801cccfe50615d002d406db302", // 60
  "fb1e9123cf3ef60c69c40527dcde5b4857e6209e813db93cb455766d78f389e6", // 24@2x
  "f4c33142db02fadac83e85f247835c4cbda4940fba747eddf7707ca161e1a2a9", // 24
  // public/images/brand-logos/joinportal-com-*.png, the name before Copilot
  "7900f426d308c05df78171dec8e66376f3dbc453d6e22a1f11786c5d40f83bfb", // 512@2x
  "d2d2a86444be9c01bb86a07ba02bbf3bc29000ba54f8d8dc952d6a29e32ecca2", // 512
  "fd5f1932d4aef78fa523a64723567b94529e5d880ff2a9bd25475a8feb05e986", // 60@2x
  "93b04b74d990dd6e9112c4ad079ad9665f4ded5575161912ddd3e04a9b000d64", // 60
  "40a72bbbc9644d65eebbdf51d2ab76f278989de945b8fd0554b99701d7212e1c", // 24@2x
  "298b34f82fa5e00c5c9afde45718ce728225b86ca6d1f7b2be00c61ab4be67c9", // 24
]);
