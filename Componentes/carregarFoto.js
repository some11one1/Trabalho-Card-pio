import * as ImagePicker from "expo-image-picker";
import { supabase } from "../Supabase";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../Supabase";
export async function fotoManager(userId) {

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7,
  });

  if (result.canceled) return null;

  const file = result.assets[0];


  const ext = file.uri.substring(file.uri.lastIndexOf(".") + 1);
  const fileName = `${userId}-${uuidv4()}.${ext}`;


  const response = await fetch(file.uri);
  const fileBlob = await response.blob();


  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, fileBlob, { upsert: true });

  if (uploadError) {
    console.log("Erro no upload:", uploadError);
    return null;
  }


  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

  return data.publicUrl;
}
