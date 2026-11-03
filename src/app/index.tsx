import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function App() {
  // Estados de la app
  const [textoMision, setTextoMision] = useState('');
  const [tareas, setTareas] = useState([]);
  const [kuramaActivo, setKuramaActivo] = useState(false); 

  const agregarTarea = () => {
    if (textoMision.trim() === '') return; // Si está vacío, no hace nada

    // Si el usuario escribe el código secreto
    if (textoMision.toLowerCase() === 'kurama' || textoMision === '123456') {
      const nuevoEstado = !kuramaActivo;
      setKuramaActivo(nuevoEstado);
      Alert.alert(
        "🦊 MODO KURAMA", 
        nuevoEstado ? "El chakra se despertó. (Escribí 'kurama' de nuevo para calmarlo)" : "Kurama se calmó."
      );
      setTextoMision('');
      return;
    }

    // Crear la tarea nueva y sumarla a la lista
    const nuevaTarea = {
      id: Date.now().toString(),
      texto: textoMision,
      completada: false
    };

    const listaActualizada = [...tareas, nuevaTarea];
    setTareas(listaActualizada);
    setTextoMision('');

    // Cuento las que faltan hacer para ver si Kurama se enoja
    const pendientes = listaActualizada.filter(t => !t.completada).length;
    
    // Si hay 3 o más, salta el cartel
    if (pendientes >= 3) {
      setKuramaActivo(true);
      Alert.alert(
        "🦊 ¡Kurama está enojado!", 
        `¡Hey! Tienes ${pendientes} misiones pendientes. ¡Ponte las pilas!`
      );
    }
  };

  // Función para tachar las tareas
  const completarTarea = (id) => {
    const tareasActualizadas = tareas.map((tarea) => {
      if (tarea.id === id) {
        return { ...tarea, completada: !tarea.completada };
      }
      return tarea;
    });
    setTareas(tareasActualizadas);

    // Si bajo de 3 pendientes, Kurama se calma
    const pendientes = tareasActualizadas.filter(t => !t.completada).length;
    if (pendientes < 3) {
      setKuramaActivo(false); 
    }
  };

  // Función para borrar tareas
  const eliminarTarea = (id) => {
    const tareasFiltradas = tareas.filter((tarea) => tarea.id !== id);
    setTareas(tareasFiltradas);

    const pendientes = tareasFiltradas.filter(t => !t.completada).length;
    if (pendientes < 3) {
      setKuramaActivo(false); 
    }
  };

  return (
    <SafeAreaView style={[styles.container, kuramaActivo && styles.containerKurama]}>
      <View style={styles.header}>
        <Text style={styles.titulo}>🍥 Naruto Shippuden 🍥</Text>
        <Text style={styles.subtitulo}>Pergamino de Misiones</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Anotar nueva misión..."
          placeholderTextColor="#888"
          value={textoMision}
          onChangeText={setTextoMision}
        />
        <TouchableOpacity style={styles.botonAgregar} onPress={agregarTarea}>
          <Text style={styles.textoBotonAgregar}>Aceptar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {tareas.map((item) => (
          <View key={item.id} style={styles.tarjetaTarea}>
            <Text style={[styles.textoTarea, item.completada && styles.textoCompletado]}>
              {item.completada ? '✅ ' : '📜 '} 
              {item.texto}
            </Text>
            
            <View style={styles.botonesAccion}>
              <TouchableOpacity onPress={() => completarTarea(item.id)} style={styles.botonCompletar}>
                <Text style={styles.textoBotonAccion}>{item.completada ? 'Desmarcar' : 'Completar'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => eliminarTarea(item.id)} style={styles.botonEliminar}>
                <Text style={styles.textoBotonAccion}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {tareas.length === 0 && (
          <Text style={styles.textoVacio}>No hay misiones pendientes, ninja. ¡Entrena!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4', 
    padding: 20,
  },
  containerKurama: {
    backgroundColor: '#FF8C00', // Tu color elegido
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C00', // Tu color elegido
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FF8C00', // Tu color elegido
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
  botonAgregar: {
    backgroundColor: '#FF8C00', // Tu color elegido
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  textoBotonAgregar: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tarjetaTarea: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#FF8C00', // Tu color elegido
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textoTarea: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  textoCompletado: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  botonesAccion: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  botonCompletar: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  botonEliminar: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  textoBotonAccion: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  textoVacio: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
  }
});
