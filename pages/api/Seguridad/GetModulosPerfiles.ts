// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";
import { ModulosPerfiles } from "../../../typings";

type Data = {
  perfiles: ModulosPerfiles[];
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
    const [PerfilesRes]: any = await connectionPool.query(
      "SELECT rol_id as Id, roltip_id as Tipo, rol_nombre as Nombre  FROM rol  where rol_id != 1 and rol_id != 5 ORDER BY (roltip_id ) ASC "
    );

    // console.log(PerfilesRes);

    res.status(200).json({ perfiles: PerfilesRes });

  } catch (error) {
    console.log(error)
    res.status(500).json({ body: "Error al consultar la información de los módulos" })
  }
}
