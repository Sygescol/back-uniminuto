// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type Data = {
  IndexSelected: number;
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
    const { SubSede } = req.query;

    const [GetMunicipioPrincipal]: any = await connectionPool.query(`
    SELECT municipioId as Municipio FROM datosUniversidad where idCoa = '${SubSede}' 
    `);

    const [GetMunicio]: any = await connectionPool.query(`
    select  municipio_id as Id  FROM municipio ORDER BY municipio_nombre ASC
    `);

    let IndexDefault = GetMunicio?.findIndex(
      (item: any) => item.Id == GetMunicipioPrincipal[0]?.Municipio
    );

    res.status(200).json({ IndexSelected: IndexDefault });
  } catch (error) {
    res.status(500).json({ body: "Internal server error" });
  }
}
