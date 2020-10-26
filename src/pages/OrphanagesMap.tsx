import React, { useState } from "react";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import mapMarker from "../images/Local.png";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {RectButton} from 'react-native-gesture-handler';
import api from '../service/api';


interface Orphanage{
  id:number;
  name: string;
  latitude: number;
  longitude: number
}


export default function OrphanafesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([])
  const navigation = useNavigation();

  useFocusEffect(() => {
     api.get('orphanages').then(resp => {
        setOrphanages(resp.data)
     }) 
    
  }) 

  function handleNavigateToOrphanageDetails(id:number) {
    navigation.navigate("OrphanagesDetails", {id});
  }

  function handleNavigateToCreateOrpahanage() {
    navigation.navigate("SelectMapPosition");
  }


  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -23.5464931,
          longitude: -46.4859181,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
      >

        {
          orphanages.map(orphanage => {
                 return(
                  <Marker
                  key={orphanage.id}
                  icon={mapMarker}
                  calloutAnchor={{
                    x: 2.7,
                    y: 0.8,
                  }}
                  coordinate={{
                    latitude: orphanage.latitude,
                    longitude: orphanage.longitude,
                  }}
                >
                  <Callout
                    tooltip={true}
                    onPress={() => {
                      handleNavigateToOrphanageDetails(orphanage.id)
                    }}
                  >
                    <View style={styles.calloutContainer}>
                  <Text style={styles.calloutText}>{orphanage.name}</Text>
                    </View>
                  </Callout>
                </Marker>
                 )    
          })
        }
      
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}> {orphanages.length} Orfanatos encontrados</Text>
        <RectButton
          style={styles.createOrphanageButton}
          onPress={() => {
            handleNavigateToCreateOrpahanage()
          }}
        >
          <Feather name="plus" size={20} color="#FFF" />
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height + 32,
  },
  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 16,
    justifyContent: "center",
  },
  calloutText: {
    color: "#8386ca",
    fontSize: 14,
  },
  footer: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: "#FFF",
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 6,
  },
  footerText: {
    color: "#8fa7b3",
  },
  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: "#15c3d6",
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
  },
});
