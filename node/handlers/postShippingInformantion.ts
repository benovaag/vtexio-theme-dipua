import axios from "axios";

interface IData {
  empresa_id: string;
  filial_id: any;
  numero_documento: string;
  tipo_documento: string;
}

export async function postShippingInformantion(
  ctx: Context,
  next: () => Promise<any>
) {
  const data: IData = ctx.state.payload;

  try {
    const resp = await axios({
      method: "post",
      url: "https://www.datafrete.com.br/cellarvinhos/api-tracking/rastrear",
      data: `tipo_documento=${data.tipo_documento}&numero_documento=${
        data.numero_documento
      }&filial_id=${data.filial_id}&empresa_id=${data.empresa_id.replace(
        ",",
        "%2C"
      )}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });
    ctx.status = 200;
    ctx.body = resp.data;
  } catch (error) {
    console.log("error", error);

    ctx.status = 500;
    ctx.body = { Message: error };
  }

  await next();
}
