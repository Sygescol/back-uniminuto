import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Documento } from "../../../../typings";

type Data = {
  documentos: Documento[];
  roles: any;
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
    const [TipoDocumentoRes]: any = await connectionPool.query(
      `SELECT tipo_docum.id, tipo_docum.nombre FROM tipo_docum ORDER BY tipo_docum.nombre`
    );
    const [RolRes]: any = await connectionPool.query(
      "SELECT rol_id as Id,rol_nombre as Nombre FROM rol WHERE roltip_id = 1 AND rol_id != 1"
    );

    res
      .status(200)
      .json({ documentos: TipoDocumentoRes, roles: RolRes } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
