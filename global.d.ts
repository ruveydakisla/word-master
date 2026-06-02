// CSS dosyalarının import edilebilmesi için TypeScript modül tanımı
declare module "*.css" {
  const content: any;
  export default content;
}