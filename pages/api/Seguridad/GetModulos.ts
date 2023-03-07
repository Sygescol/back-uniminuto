import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";
import { Modulos } from "../../../typings";

type Data = {
  Modulos: Modulos[];
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
    const [Modulos]: any = await connectionPool.query(
      "SELECT mod_id as Id, mod_nombre as Nombre FROM NewModulosSygescol WHERE submod_id = 0"
    );

    let Menu = [];
    if (Modulos?.length > 0) {
      for (const Module of Modulos) {
        const [SubModulos]: any = await connectionPool.query(
          `select mod_nombre as SubModulo,mod_image as Icon,mod_link as Link ,mod_id as id from NewModulosSygescol where submod_id = ${Module?.Id} and submod_id != 0`
        );

        Menu.push({
          Id: Module?.Id,
          NombreModulo: Module?.Nombre,
          SubModulos: SubModulos || [],
        });
      }
    }
    res.status(200).json({ Modulos: Menu });
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal Server Error" });
  }
}
