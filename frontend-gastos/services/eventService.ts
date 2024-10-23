
export const fetchUserEvents = async (userId: number) => {
//export const fetchUserEvents = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/eventos/summary-user/${userId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Error fetching user events");
      }
  
      const json = await response.json();
      return json.result; // Retorna la lista de eventos
    } catch (error) {
      console.error("Error fetching user events:", error);
      throw error; // Re-lanza el error para manejarlo donde se use esta función
    }
  };
  
  export const fetchEventDate = async (eventId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/eventos/${eventId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching date for event ID: ${eventId}`);
      }
  
      const json = await response.json();
      return json.result.fecha; // Retorna solo la fecha
    } catch (error) {
      console.error(`Error fetching date for event ID ${eventId}:`, error);
      throw error; // Re-lanza el error para manejarlo donde se use esta función
    }
  };


export type CreateEventPayload = {
    nombre_evento: string;
    fecha: string;
    creado_por: number;
    descripcion: string;
  };

// Función para crear un evento
export const createEvent = async (eventData: CreateEventPayload): Promise<void> => {
  try {
    const response = await fetch("http://localhost:3000/api/eventos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error creating event.");
    }

    console.log("Evento creado correctamente:", data);
  } catch (error) {
    console.error("Error al crear el evento:", error);
    throw error; // Re-lanza el error para manejarlo donde se use esta función
  }
};