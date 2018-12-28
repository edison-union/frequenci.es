for i in *.wav;
  do name=`echo $i | cut -d'.' -f1`;
  echo $name;
  ffmpeg -i "$i" -vn -ar 44100 -ac 2 -ab 192k -f mp3 -y ${name}.mp3

done
