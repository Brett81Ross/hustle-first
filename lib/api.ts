export const API_ERROR={unauthorized:"Unauthorized",invalidJson:"Request body must be valid JSON.",failed:"Request failed."} as const;
export async function readJson(request:Request){const type=request.headers.get("content-type")?.toLowerCase()??"";if(!type.includes("application/json"))throw new Error(API_ERROR.invalidJson);try{return await request.json()}catch{throw new Error(API_ERROR.invalidJson)}}
export function errorMessage(error:unknown){return error instanceof Error?error.message:API_ERROR.failed}
export function errorStatus(message:string){if(message===API_ERROR.unauthorized)return 401;if(message===API_ERROR.invalidJson)return 400;return 400}
export function noStoreHeaders(){return {"Cache-Control":"private, no-store, max-age=0","X-Content-Type-Options":"nosniff"}}