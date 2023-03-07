// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../config/db";
import { User } from "../../typings";

type Data = {
  user: User[];
  Menu: any[];
  DemasInfo: {};
  Notificaciones: [];
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

    let consulta = `SELECT rol, rol_nombre, idUsuario, tipo, subsede,ChangePass FROM usuario INNER JOIN rol ON usuario.rol = rol.rol_id WHERE login = '${Usuario?.toLowerCase()}' AND pass = '${Pass}'`;

    let DemasInfo = {};
    let Notificaciones: [] = [];

    const [user]: any = await connectionPool.query(consulta);

    let Menu = [];

    if (user?.length > 0) {
      if (user[0]?.tipo == "ADMINISTRATIVO") {
        const [Administrativo]: any = await connectionPool.query(
          `
          SELECT concat(admco.admco_nom1,' ',admco.admco_nom2) as Nombre,concat(admco.admco_ape1,' ',admco.admco_ape2) as Apellidos,admco.documento as Documento FROM admco WHERE id = ${user[0]?.idUsuario}
          `
        );

        DemasInfo = {
          Nombre: Administrativo[0]?.Nombre,
          Apellidos: Administrativo[0]?.Apellidos,
          Documento: Administrativo[0]?.Documento,
          RolTipo: user[0]?.rol,
          Id: user[0]?.idUsuario,
        };
      }
      if (user[0]?.tipo == "ESTUDIANTE") {
        const [Estudiante]: any = await connectionPool.query(
          `select alumno_num_docu as Documento,concat (alumno_nom1,' ',alumno_nom2) as Nombre,concat (alumno_ape1,' ',alumno_ape2) as Apellidos from pfc_alumno where alumno_id = ${user[0]?.idUsuario}`
        );
        DemasInfo = {
          Nombre: Estudiante[0]?.Nombre,
          Apellidos: Estudiante[0]?.Apellidos,
          Documento: Estudiante[0]?.Documento,
          RolTipo: user[0]?.rol,
          Id: user[0]?.idUsuario,
        };
      }

      if (user[0]?.tipo == "PROFESOR") {
        const [NotificacionesRes]: any = await connectionPool.query(
          `SELECT id, Rol,message,date_range_start,date_range_end,Link,date_created FROM notifications WHERE Rol='${user[0]?.rol}' AND user_id='${user[0]?.idUsuario}' AND status='0' ORDER BY date_created DESC`
        );
        Notificaciones = NotificacionesRes;

        const [Docente]: any = await connectionPool.query(
          `select concat(dcne.dcne_nom1,' ',dcne.dcne_nom2) as Nombre, concat(dcne.dcne_ape1,' ',dcne.dcne_ape2) as Apellidos,dcne_num_docu as Documento  from dcne
          where dcne.i = ${user[0]?.idUsuario}`
        );
        DemasInfo = {
          Nombre: Docente[0]?.Nombre,
          Apellidos: Docente[0]?.Apellidos,
          Documento: Docente[0]?.Documento,
          RolTipo: user[0]?.rol,
          Id: user[0]?.idUsuario,
        };
      }

      let key = 100;

      const [Modulos]: any = await connectionPool.query(`
      SELECT NewModulosSygescol.mod_nombre as Nombre,NewModulosSygescol.mod_image as Icon,NewModulosSygescol.mod_link as Link ,NewModulosSygescol.mod_id as id FROM ModulosPerfilAcceso INNER JOIN NewModulosSygescol ON (ModulosPerfilAcceso.mod_id=NewModulosSygescol.mod_id) WHERE ModulosPerfilAcceso.perfil_id=${user[0]?.rol} and NewModulosSygescol.submod_id = 0 
      `);

      if (Modulos?.length > 0) {
        for (const Module of Modulos) {
          console.log(`SELECT NewModulosSygescol.mod_nombre as SubModulo,NewModulosSygescol.mod_image as Icon,NewModulosSygescol.mod_link as Link ,NewModulosSygescol.mod_id as id FROM ModulosPerfilAcceso INNER JOIN NewModulosSygescol ON (ModulosPerfilAcceso.mod_id=NewModulosSygescol.mod_id) WHERE ModulosPerfilAcceso.perfil_id=${user[0]?.rol} and NewModulosSygescol.submod_id != 0 and NewModulosSygescol.submod_id=${Module.id} order by NewModulosSygescol.mod_posicion
          `);

          const [SubModulos]: any = await connectionPool.query(
            `SELECT NewModulosSygescol.mod_nombre as SubModulo,NewModulosSygescol.mod_image as Icon,NewModulosSygescol.mod_link as Link ,NewModulosSygescol.mod_id as id FROM ModulosPerfilAcceso INNER JOIN NewModulosSygescol ON (ModulosPerfilAcceso.mod_id=NewModulosSygescol.mod_id) WHERE ModulosPerfilAcceso.perfil_id=${user[0]?.rol} and NewModulosSygescol.submod_id != 0 and NewModulosSygescol.submod_id=${Module.id} order by NewModulosSygescol.mod_posicion
            `
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
      res.status(200).json({
        user: user as User[],
        DemasInfo,
        Menu: Menu || [],
        Notificaciones: Notificaciones || [],
      });
      return;
    } else {
      res.status(401).json({ body: "Unauthorized" });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal Server Error" });
    return;
  }
}
