//pause the audio
pauseRecordedAudio = async () => {
  await Audio.setAudioModeAsync({
    // set to false to play through speaker (instead of headset)
    //this is Makayla's code
    allowsRecordingIOS:true,
   interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX=0,
    playsInSilentModeIOS:true,
    shouldDuckAndroid:true,
   interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX=1,
    playThroughEarpieceAndroid:false,
    staysActiveInBackground:true,
  });

   const soundObject = new Audio.Sound();
  try {
    await soundObject.loadAsync({ uri:uri});
    await soundObject.setStatusAsync({ isLooping: false });
    await soundObject.pauseAsync();
    console.log('we are pausing the recording!')
  } catch (error) {
    console.log('An error occurred on pausing:');
    console.log(error);
  }
};

