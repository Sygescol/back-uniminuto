import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";

type Data = {};

type ErrorData = {
  body: string;
};

export default async function handlerAddDatos(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }

  try {
    const { TipoModulo, ModuloPrincipal, Nombre, NombreModuloPrincipal } =
      req.body;

    if (TipoModulo === 1) {
      const [ModuloExistente]: any = await connectionPool.query(`
      SELECT mod_id as Id,mod_nombre as Nombre FROM NewModulosSygescol WHERE mod_nombre = '${Nombre?.toUpperCase()}'
    `);

      if (ModuloExistente?.length > 0) {
        res.status(200).json({ body: "Modulo Existente" });
        return;
      }
      const [InsertPrincipal]: any = await connectionPool.query(
        `INSERT INTO NewModulosSygescol (submod_id, mod_nombre, mod_link) VALUES (0,'${Nombre?.toUpperCase()}','/')`
      );

      const [InsertSoporte]: any = await connectionPool.query(
        `insert into ModulosPerfilAcceso (perfil_id,mod_id) values ('1','${InsertPrincipal?.insertId}'),('5','${InsertPrincipal?.insertId}') `
      );
      if (InsertPrincipal.affectedRows > 0) {
        res.status(200).json({ body: "Módulo Principal Creado" });
      }
    }

    if (TipoModulo === 2) {
      const [SubModuloExistente]: any = await connectionPool.query(`
      SELECT mod_id as Id,mod_nombre as Nombre FROM NewModulosSygescol WHERE mod_nombre = '${Nombre?.toUpperCase()}' and submod_id != 0
    `);

      if (SubModuloExistente?.length > 0) {
        res.status(200).json({ body: "SubMódulo ya existente " });
        return;
      }

      const [OrderModulo]: any = await connectionPool.query(
        `select max(mod_posicion) as maximo from NewModulosSygescol where submod_id = '${ModuloPrincipal}' and submod_id != 0
        `
      );

      let ModulosRuta = NombreModuloPrincipal?.split(" ")
        .map((word: any) => {
          return word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase();
        })
        .join("");

      const ModuloPrincipalName = Nombre?.split(" ")
        .map((word: any) => {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join("");

      const [InsertSubModulo]: any = await connectionPool.query(
        `INSERT INTO NewModulosSygescol (submod_id, mod_nombre, mod_link,mod_posicion) VALUES (${ModuloPrincipal},'${Nombre?.toUpperCase()}','${ModulosRuta.normalize(
          "NFD"
        ).replace(/[\u0300-\u036f]/g, "")}/${ModuloPrincipalName.normalize(
          "NFD"
        ).replace(/[\u0300-\u036f]/g, "")}','${
          OrderModulo[0].maximo + 1 || 1
        }')`
      );

      const [InsertSoporte]: any = await connectionPool.query(
        `insert into ModulosPerfilAcceso (perfil_id,mod_id) values ('1','${InsertSubModulo?.insertId}'),('5','${InsertSubModulo?.insertId}') `
      );
      if (InsertSubModulo.affectedRows > 0) {
        res.status(200).json({ body: "SubMódulo Creado" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal Server Error" });
  }
}
