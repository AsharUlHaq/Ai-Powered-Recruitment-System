// custom.d.ts
// If TypeScript still doesn't recognize JSON files, you may need to create a custom declaration file. Create a file named custom.d.ts in your src folder (or wherever your TypeScript declaration files are):
declare module "*.json" {
  const value: any;
  export default value;
}
