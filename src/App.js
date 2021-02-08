import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from "react";
import * as tf from '@tensorflow/tfjs';

function App() {
  const [result, setResult] = useState();
  const [model,setModel] = useState();
  const [prob, setProb] = useState();
  const c2i = {" ": 0, "a": 1, "b": 2, "c": 3, "d": 4, "e": 5, "f": 6, "g": 7, "h": 8, "i": 9, "j": 10, "k": 11, "l": 12, "m": 13, "n": 14, "o": 15, "p": 16, "q": 17, "r": 18, "s": 19, "t": 20, "u": 21, "v": 22, "w": 23, "x": 24, "y": 25, "z": 26};
  const max_len = 10;
  const shape = [1, max_len];

  function vector_text(text){
    text = text.toLowerCase();
    
    let arr = [];
    for(var i=0;i<text.length;i++){
      if(text[i].match("[a-z ]"))
        arr.push(c2i[text[i]]);
    }
    for(var i=arr.length;i<max_len;i++){
      arr.push(0);
    }

    return arr;
  }

  function handleSubmit(){
    setResult();
    let val = document.getElementById('input_id').value;
    let arr = vector_text(val);
    
    let tensor_pred = model.predict(tf.tensor2d(arr, shape)).dataSync();
    setProb(tensor_pred);
    if(tensor_pred>0.5)
      setResult(1)   
    else
      setResult(0)
  }

  function probability_text(){
    let gender = (prob > 0.5)? "Male" : "Female";
    let val = (prob) > 0.5 ? prob : 1-prob;
    return <p>Predicted {gender} with probability {(val * 100).toFixed(2)}%</p>
  }

  function get_gender_icon(gender){
    let url = window.location.href;
    if(!url.endsWith("/")){
      url += "/"
    }
    if(gender==0){
      return <div>{probability_text()}<img style={{width:"50", height:"50"}} src={url + "female.png"}/></div>
    }
    else if(gender==1) return <div>{probability_text()}<img style={{width:"50", height:"50"}} src={url + "male.png"}/></div>
  }

  useEffect(() => {
    tf.ready().then(async ()=>{
        let _model = await tf.loadLayersModel(process.env.PUBLIC_URL + `/model/model.json`);
        setModel(_model);
    })
    return () => {
      setModel();
      setProb();
      setResult();
    }
  }, [])

  return (
    <div className="App">
      <h1>Indian Name Gender Classification</h1>
      <p>This is a React & Tensorflow.JS based project that uses Keras ML model to classify a given name as either female or male. The model has been trained on Indian Names.</p>
      <a href="https://github.com/rahuldshetty/indian-name-detection-tfjs.git" style={{"textDecoration":"none"}}>
        <i class="fa fa-github" > Source Code</i>
      </a>
      <div style={{margin:"auto"}}>
        <input id="input_id" type="text" placeholder="Enter name..." onChange={handleSubmit}/>
      </div>
      {get_gender_icon(result)}
    </div>
  );
}

export default App;
