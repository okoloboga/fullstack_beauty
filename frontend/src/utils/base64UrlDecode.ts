export const base64UrlDecode = (str: string): string => {
    // Заменяем '-' на '+' и '_' на '/'
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  
    // Добавляем символы заполнения '=' для корректного декодирования
    while (base64.length % 4) {
      base64 += '=';
    }
  
    return atob(base64);
  };