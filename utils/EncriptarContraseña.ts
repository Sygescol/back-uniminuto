// generar un algoritmo de encriptación en ts donde el único carácter especial sean los siguientes "@,." y tenga una longitud de 12 caracteres
// ejemplo: @.a1b2c3d4e5f6

const EncriptarContraseña = (): any => {
  const caracteresEspeciales = ["@", "-"];
  const caracteres = "abcdefghijklmnopqrstuvwxyz0123456789";
  let encriptado = "";
  for (let i = 0; i < 12; i++) {
    if (i === 0 || i === 1) {
      encriptado +=
        caracteresEspeciales[
          Math.floor(Math.random() * caracteresEspeciales.length)
        ];
    } else {
      encriptado += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
  }
  return encriptado;
};

export default EncriptarContraseña;
