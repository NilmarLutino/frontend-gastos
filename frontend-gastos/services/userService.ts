// Función para obtener la información del perfil de usuario por su ID
export const fetchUserProfile = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      if (data && data.result) {
        return data.result; // Retorna los datos del perfil del usuario
      } else {
        throw new Error("User data not found.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error; // Re-lanza el error para manejarlo donde se use esta función
    }
  };
  
  // Función para obtener la información del rol de usuario por su ID de rol
  export const fetchUserRole = async (roleId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/roles/${roleId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      if (data && data.result) {
        const { nombre_rol, detalle_rol } = data.result;
        return {
          id: roleId,
          nombre_rol,
          descripcion: detalle_rol.descripcion,
        };
      } else {
        throw new Error("Role data not found.");
      }
    } catch (error) {
      console.error("Error fetching role data:", error);
      throw error; // Re-lanza el error para manejarlo donde se use esta función
    }
  };
  