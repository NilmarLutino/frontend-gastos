import React, { useState, useEffect  } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import LoadReceipt from "@/components/modals/loadReceipt";
import AddConcepts from "@/components/modals/addConcept";
import InvoiceModal from "@/components/modals/invoiceModal";
import { fetchEventParticipants } from "../../services/eventService";


export default function SubirFactura() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Controla la visibilidad del modal
  const [isAddConceptsModalVisible, setIsAddConceptsModalVisible] = useState(false); // Modal para agregar conceptos
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false); // Modal para asignar facturas
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState<any | null>(null); // Datos combinados para InvoiceModal
  const [participantes, setParticipantes] = useState<{ id: string; name: string }[]>([]);

  const router = useRouter();
  const params = useLocalSearchParams(); // Obtén los parámetros enviados
  const { groupId} = params;


    useEffect(() => {
      const loadParticipants = async () => {
        if (!groupId) {
          console.error("Group ID is required to fetch participants.");
          return;
        }
  
        try {
          const result = await fetchEventParticipants(groupId as string);
          const participantesData = result.map((p: any) => ({
            id: p.usuario_id.toString(),
            name: p.nombre_usuario,
          }));
          setParticipantes(participantesData); // Guardar participantes en el estado
        } catch (error) {
          console.error("Error fetching participants:", error);
          Alert.alert("Error", "No se pudieron cargar los participantes.");
        }
      };
  
      loadParticipants();
    }, [groupId]);

    console.log("EVENTO ID", groupId);
    console.log("PARTICANTES ID", participantes);
  
    const pickImage = async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso denegado", "Se requiere acceso a la galería.");
          return;
        }
  
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
  
        if (!result.canceled) {
          setImageUri(result.assets[0].uri);
        }
      } catch (error) {
        console.error("Error al seleccionar la imagen:", error);
        Alert.alert("Error", "No se pudo acceder a la galería.");
      }
    };
  
    const uploadImage = async () => {
      if (!imageUri) {
        Alert.alert("Advertencia", "Primero selecciona una imagen.");
        return;
      }
  
      setIsLoading(true);
  
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
  
        const formData = new FormData();
        formData.append("imagen", blob, "factura.jpg");
  
        const uploadResponse = await fetch("http://192.168.0.3:5000/api/factura/procesar", {
          method: "POST",
          body: formData,
        });
  
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Error del servidor: ${errorText}`);
        }
  
        const data = await uploadResponse.json();
        setReceiptData(data);
        setIsModalVisible(true);
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        Alert.alert("Error", "No se pudo conectar con el servidor.");
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleAssignIndividually = () => {
      if (!receiptData || !receiptData.datos || !receiptData.datos.items) {
        Alert.alert("Error", "No hay datos de la factura para asignar.");
        return;
      }
  
      const combinedData = {
        groupId,
        participantes,
        items: receiptData.datos.items,
      };
  
      setInvoiceDetails(combinedData);
      setIsModalVisible(false);
      setIsInvoiceModalVisible(true);
    };

    const handleSplitEqually = () => {   
      const splitData = {
        groupId: groupId as string,
        totalAmount: receiptData.datos.total,
      };
    
      console.log("Datos para repartir equitativamente:", splitData);
    
      setIsAddConceptsModalVisible(true); // Muestra el modal de conceptos
    };
    
    
    
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Subir Factura</Text>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>Ninguna imagen seleccionada</Text>
        )}
  
        {isLoading && (
          <ActivityIndicator size="large" color="#BF0413" style={styles.activityIndicator} />
        )}
  
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.redButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Seleccionar Imagen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.redButton} onPress={uploadImage}>
            <Text style={styles.buttonText}>Analizar Factura</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.redButton} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
  
        <LoadReceipt
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          receiptData={receiptData}
          onSplitEqually={() => {
            setIsModalVisible(false);
            setIsAddConceptsModalVisible(true);
          }}
          onAssignIndividually={handleAssignIndividually}
        />
  
          <AddConcepts
          visible={isAddConceptsModalVisible}
          onClose={() => setIsAddConceptsModalVisible(false)}
          onRepartir={handleSplitEqually}
          groupId={groupId as string} 
          totalAmount={receiptData?.datos?.total}
        />


        
        <InvoiceModal
          visible={isInvoiceModalVisible}
          onClose={() => setIsInvoiceModalVisible(false)}
          onAssign={(selectedUsers) => {
            console.log("Usuarios asignados:", selectedUsers);
            setIsInvoiceModalVisible(false);
          }}
          invoiceDetails={invoiceDetails}
        />
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ece2d9",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#262626",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderColor: "#BF0413",
    borderWidth: 2,
    marginBottom: 20,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  redButton: {
    backgroundColor: "#BF0413",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "#f2f2f2",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  activityIndicator: {
    marginVertical: 20,
  },
});
