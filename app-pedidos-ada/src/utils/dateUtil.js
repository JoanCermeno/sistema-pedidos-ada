// dateUtils.js

// 1. Convertir Date a yyyy-mm-dd
export function dateToYyyyMmDd(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  export function dateToDdMmYyyy(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }
  // 2. Convertir yyyy-mm-dd a dd-mm-yyyy con hora
export function yyyyMmDdToDdMmYyyy(fechaBd) {
    // Separar fecha y hora (si la hora existe)
    const [fecha, hora] = fechaBd.split(' ');
  
    // Convertir fecha
    const [yyyy, mm, dd] = fecha.split('-');
    const fechaFormateada = `${dd}-${mm}-${yyyy}`;
  
    // Agregar hora si existe
    return hora ? `${fechaFormateada} ${hora}` : fechaFormateada;
  }
  
  
export function convertirHora24a12(hora24) {
  // 1. Separar las horas, minutos y segundos
  const [horas, minutos, segundos] = hora24.split(':');

  // 2. Convertir las horas a número
  let horasNum = parseInt(horas);

  // 3. Determinar si es AM o PM
  const ampm = horasNum >= 12 ? 'PM' : 'AM';

  // 4. Convertir a formato de 12 horas
  horasNum = horasNum % 12 || 12; // Si es medianoche (0), se convierte a 12

  // 5. Formatear la hora
  const hora12 = `${horasNum.toString().padStart(2, '0')}:${minutos.padStart(2, '0')} ${ampm}`;

  return hora12;
}

export function dateToHhMmSs(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
} 
