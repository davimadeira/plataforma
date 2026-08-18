const defaults={whatsapp:"",bookTitle:"Livro de Matheus Vidal",bookPrice:"49,90",purchaseUrl:""};
export async function GET(){return Response.json(defaults)}
export async function PUT(){return Response.json({ok:false,error:"Configuração permanente será conectada ao banco de produção."},{status:503})}
