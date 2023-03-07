// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorData>
) {
  if (req.method !== "PUT") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }

  try {
    const {
      Rol,
      IdUser,
      Nombre,
      Apellidos,
      Correo,
      Documento,
      Usuario,
      Pass,
      Celular,
      TipoDocumento,
    } = req.body;

    // verificar rol para saber que tabla actualizar

    const [getTipo]: any = await connectionPool.query(`
    SELECT tipo FROM usuario WHERE idUsuario = ${IdUser} and rol='${Rol}'`);

    if (getTipo[0]?.tipo == "ADMINISTRATIVO") {
      const [updateAdmin]: any = await connectionPool.query(`
        UPDATE admco SET admco_ape1 = '${
          Apellidos?.split(" ")[0] || ""
        }',admco_ape2 = '${Apellidos?.split(" ")[1] || ""}', admco_nom1 = '${
        Nombre?.split(" ")[0] || ""
      }',admco_nom2 = '${
        Nombre?.split(" ")[1] || ""
      }',admco_celular='${Celular}',tipo_documento='${TipoDocumento}', mail = '${Correo}', documento = '${Documento}' WHERE id = ${IdUser}`);

      if (updateAdmin.affectedRows === 0) {
        res
          .status(400)
          .json({ body: "No se pudo editar la información personal" });
        return;
      }
    }

    if (getTipo[0]?.tipo == "ESTUDIANTE") {
      const [updateStudent]: any = await connectionPool.query(`
        UPDATE pfc_alumno SET alumno_ape1 = '${
          Apellidos?.split(" ")[0]?.toUpperCase() || ""
        }',alumno_ape2 = '${
        Apellidos?.split(" ")[1]?.toUpperCase() || ""
      }', alumno_nom1 = '${
        Nombre?.split(" ")[0]?.toUpperCase() || ""
      }',alumno_nom2 = '${
        Nombre?.split(" ")[1]?.toUpperCase() || ""
      }',alumno_celular='${Celular}',tipo_docu_id='${TipoDocumento}', alumno_email = '${Correo}', alumno_num_docu = '${Documento}' WHERE alumno_id = ${IdUser}`);

      if (updateStudent?.affectedRows === 0) {
        res
          .status(400)
          .json({ body: "No se pudo editar la información personal" });
        return;
      }
    }

    if (getTipo[0]?.tipo == "PROFESOR") {
      const [updateTeacher]: any = await connectionPool.query(`
      UPDATE dcne SET dcne_ape1 = '${
        Apellidos?.split(" ")[0]?.toUpperCase() || ""
      }',dcne_ape2 = '${
        Apellidos?.split(" ")[1]?.toUpperCase() || ""
      }', dcne_nom1 = '${
        Nombre?.split(" ")[0]?.toUpperCase() || ""
      }',dcne_nom2 = '${
        Nombre?.split(" ")[1]?.toUpperCase() || ""
      }',dcne_email_perso='${Correo}',dcne_num_docu='${Documento}',dcne_celular='${Celular}',tipo_docu_id='${TipoDocumento}' WHERE i = ${IdUser}
      `);

      if (updateTeacher?.affectedRows === 0) {
        res
          .status(400)
          .json({ body: "No se pudo editar la información personal" });
        return;
      }
    }

    const [UpdateUser]: any = await connectionPool.query(`
    UPDATE usuario SET login = '${Usuario}', pass = '${Pass}' WHERE idUsuario = ${IdUser} and rol='${Rol}'`);

    if (UpdateUser?.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo editar el usuario" });
      return;
    }

    res.status(200).json({
      body: "Se editó correctamente. por favor, vuelva a ingresar a la aplicación",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal Server Error" });
    return;
  }
}
