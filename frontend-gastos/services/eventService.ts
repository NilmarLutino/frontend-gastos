// services/eventsService.ts
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
  
  export const fetchEventDetails = async (eventId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/eventos/${eventId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching details for event ID: ${eventId}`);
      }
  
      const json = await response.json();
      return {
        fecha: json.result.fecha,
        creado_por: json.result.creado_por,
      }; // Retorna un objeto con la fecha y el creador
    } catch (error) {
      console.error(`Error fetching details for event ID ${eventId}:`, error);
      throw error; // Re-lanza el error para manejarlo donde se use esta función
    }
  };
  

  export const fetchEventSummary = async (groupId: string, userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/eventos/summary/${groupId}?userId=${userId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error fetching event summary for ID: ${groupId}`);
      }
  
      const json = await response.json();
      return json.result; // Retorna el resumen del evento
    } catch (error) {
      console.error(`Error fetching event summary for ID ${groupId}:`, error);
      throw error; // Re-lanza el error para manejarlo donde se use esta función
    }
  };
  
  export const fetchEventParticipants = async (groupId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/participantes/event/${groupId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching participants for event ID: ${groupId}`);
      }
  
      const json = await response.json();
      return json.result; // Retorna la lista de participantes
    } catch (error) {
      console.error(`Error fetching participants for event ID ${groupId}:`, error);
      throw error;
    }
  };
  
  export const fetchEventParticipantExpenses = async (participantId: string, groupId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/gastos/participante/${participantId}/evento/${groupId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching expenses for participant ID: ${participantId} and event ID: ${groupId}`);
      }
  
      const json = await response.json();
      return json.result; // Retorna la lista de gastos
    } catch (error) {
      console.error(`Error fetching expenses for participant ID ${participantId} and event ID ${groupId}:`, error);
      throw error;
    }
  };
  
  export const createExpense = async (
    eventoId: number,
    monto: number,
    categoria: string,
    descripcion: string,
    agregadoPor: number
  ) => {
    try {
      const response = await fetch("http://localhost:3000/api/gastos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          evento_id: eventoId,
          monto,
          categoria,
          descripcion,
          fecha: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
          agregado_por: agregadoPor,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Error al crear el gasto");
      }
  
      const json = await response.json();
      return json.result; // Devuelve el resultado de la creación del gasto
    } catch (error) {
      console.error("Error al crear el gasto:", error);
      throw error;
    }
  };

  export const fetchUserByEmail = async (email: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/email/${email}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching user with email: ${email}`);
      }
  
      const json = await response.json();
      return json.result;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };
  
  export const addParticipant = async (eventoId: string, usuarioId: string, rolesId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/participantes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          evento_id: eventoId,
          usuario_id: usuarioId,
          ha_pagado: false,
          roles_id: rolesId,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Error al agregar el participante");
      }
  
      const json = await response.json();
      return json.result;
    } catch (error) {
      console.error("Error adding participant:", error);
      throw error;
    }
  };
  
  