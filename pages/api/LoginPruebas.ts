// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../config/db";
import { User } from "../../typings";

type Data = {
  user: User[];
  Menu: any[];
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
    const {
      InputValues: { Usuario, Pass },
    } = req.body;

    let consulta = `SELECT usu_rol, rol_nombre FROM usuario 
    INNER JOIN rol ON usuario.usu_rol = rol.rol_id 
    WHERE usu_login = '${Usuario?.toLowerCase()}' AND usu_password = '${Pass}'`;
    // if (Usuario != "soporte") {
    //   consulta = `SELECT usu_rol, rol_nombre FROM usuario
    //                     INNER JOIN rol ON usuario.usu_rol = rol.rol_id
    //                     INNER JOIN admco ON usuario.usu_fk = admco.id
    //                     WHERE usu_login = '${Usuario}' AND usu_password = '${Pass}' `;
    // } else {
    //   consulta = `SELECT usu_rol, rol_nombre FROM usuario
    //                     INNER JOIN rol ON usuario.usu_rol = rol.rol_id
    //                     WHERE usu_login = '${Usuario}' AND usu_password = '${Pass}'`;
    // }

    const [user]: any = await connectionPool.query(consulta);
    let Menu = [];

    if (user?.length > 0) {
      let key = 100;
      const [Modulos]: any = await connectionPool.query(`
      SELECT mod_nombre as Nombre,ModulosPerfilAcceso.mod_id as Id FROM ModulosPerfilAcceso INNER JOIN NewModulosSygescol ON (NewModulosSygescol.mod_id=ModulosPerfilAcceso.mod_id) where ModulosPerfilAcceso.perfil_id= ${user[0]?.usu_rol}
      `);

      if (Modulos?.length > 0) {
        for (const Module of Modulos) {
          const [SubModulos]: any = await connectionPool.query(
            `select mod_nombre as SubModulo,mod_image as Icon,mod_link as Link ,mod_id as id from NewModulosSygescol where submod_id = ${Module?.Id} and submod_id != 0`
          );

          if (SubModulos?.length > 0) {
            Menu.push({
              key: key++,
              NombreModulo: Module.Nombre,
              SubModulos: SubModulos,
            });
          }
        }
      }
    }

    if ((user as User[]).length > 0) {
      res.status(200).json({ user: user as User[], Menu: Menu || [] });
      return;
    } else {
      res.status(401).json({ body: "Unauthorized" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal Server Error" });
    return;
  }
}
