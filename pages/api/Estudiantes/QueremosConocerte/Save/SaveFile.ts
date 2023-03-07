import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../../config/db";
type Data = {
  pdf: any;
  Documento: any;
  TipoArchivo: string;
  Seccion: string;
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { pdf, Documento, TipoArchivo, Seccion } = req.body;
    const [UpdateInfoPdfDb] = await connectionPool.query(
      `INSERT INTO documentos_matricula VALUES ('','${Documento || ""}','${
        pdf?.ruta || ""
      }','${TipoArchivo || ""}','${Seccion || ""}')`
    );
    res.status(200).json({ body: "Información Cargada Con Exitó" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
