// services/eventsService.ts
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
  