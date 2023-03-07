import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Administrativo } from "../../../../typings";

type Data = {};

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
      Password,
      Nombre,
      Apellidos,
      TipoDocumento,
      NumeroDocumento,
      Cargo,
      Perfil,
      Correo,
      Genero,
      IdSubSede,
    } = req.body;

    const [VerificarExistencia]: any = await connectionPool.query(
      `SELECT * FROM usuario WHERE login = '${
        Nombre?.split(" ")[0]
          ?.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") || ""
      }${
        Apellidos?.split(" ")[0]
          ?.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") || ""
      }' and tipo = 'ADMINISTRATIVO'`
    );
    if (VerificarExistencia.length > 0) {
      res.status(400).json({ body: "El colaborador ya existe" });
      return;
    }

    const [AdministrativoAdd]: any = await connectionPool.query(`
    INSERT INTO admco (nombre, admco_ape1, admco_ape2, admco_nom1, admco_nom2, documento, tipo_documento, cargo,mail,genero,subSedeId) values ('${Apellidos} ${Nombre}', '${
      Apellidos?.split(" ")[0]?.toUpperCase() || ""
    }', '${Apellidos?.split(" ")[1]?.toUpperCase() || ""}', '${
      Nombre?.split(" ")[0]?.toUpperCase() || ""
    }', '${
      Nombre?.split(" ")[1]?.toUpperCase() || ""
    }', '${NumeroDocumento}', '${TipoDocumento}', '${Cargo.toUpperCase()}','${Correo}','${Genero}','${IdSubSede}')
    `);

    if (AdministrativoAdd.affectedRows === 0) {
      res.status(400).json({ body: "No se puedo agregar el colaborador" });
      return;
    }

    const [AddUser]: any = await connectionPool.query(`
    INSERT INTO usuario (login, pass, rol, tipo, idUsuario,subsede) values ('${
      Nombre?.split(" ")[0]
        ?.toLowerCase()
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") || ""
    }${
      Apellidos?.split(" ")[0]
        ?.toLowerCase()
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") || ""
    }', '${NumeroDocumento}', '${Perfil || ""}', 'ADMINISTRATIVO', '${
      AdministrativoAdd.insertId
    }','${IdSubSede}')`);

    if (AddUser.affectedRows === 0) {
      res.status(400).json({ body: "No se puedo agregar el usuario" });
      return;
    }

    res.status(200).json({
      body: "Colaborador agregado correctamente",
    } as Data);
  } catch (error) {
    console.error(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
