import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Documento } from "../../../../typings";

type Data = {
  documentos: Documento[];
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "GET") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const [DocumentosRes]: any = await connectionPool.query(
      `SELECT id as Id,codigo as Codigo,nombre as Nombre FROM tipo_docum ORDER BY tipo_docum.codigo ASC`
    );

    res.status(200).json({ documentos: DocumentosRes } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
