import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";
import { ModulosSelect } from "../../../typings";

type Data = {
  Modulos: ModulosSelect[];
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
    const { Id } = req.query;

    const [Modulos]: any = await connectionPool.query(
      "SELECT mod_id as Id, mod_nombre as Nombre FROM NewModulosSygescol WHERE submod_id = 0"
    );

    let Menu = [];
    if (Modulos?.length > 0) {
      for (const Module of Modulos) {
        const [SubModulos]: any = await connectionPool.query(
          `select mod_nombre as label ,mod_id as value from NewModulosSygescol where submod_id = ${Module?.Id} and submod_id != 0`
        );

        let SubModulosActivos = [];

        if (Id) {
          const [SubmodulosActivosRes]: any = await connectionPool.query(`
          select NewModulosSygescol.mod_nombre as label,NewModulosSygescol.mod_id as value from NewModulosSygescol INNER JOIN ModulosPerfilAcceso ON (ModulosPerfilAcceso.mod_id=NewModulosSygescol.mod_id) where NewModulosSygescol.submod_id = ${Module?.Id} and submod_id != 0 and ModulosPerfilAcceso.perfil_id = ${Id}
          `);

          SubModulosActivos = SubmodulosActivosRes;
        }

        Menu.push({
          Id: Module?.Id,
          NombreModulo: Module?.Nombre,
          SubModulos: SubModulos || [],
          SubModulosActivos: SubModulosActivos,
        });
      }
    }

    res.status(200).json({ Modulos: Menu });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({ body: "Internal server error" });
  }
}
