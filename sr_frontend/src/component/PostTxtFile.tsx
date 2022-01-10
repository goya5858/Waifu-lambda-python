import axios from 'axios';
import {ChangeEvent, useState} from "react";

const PostTxtFile = () => {
  const [rawData,    setRawData]    = useState<string>();
  const [submitData, setSubmitData] = useState<string>();

  // Inputが変更されるたびに表示&提出用のデータを更新
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log( typeof e.target.value );
    //console.log( e.target.files );
    setRawData( e.target.value ); //提出する生データ

    // 生のtextデータをファイルデータへ変換 (確認のため)
    const fileData = new File( [ e.target.value] , "text.txt",
                     {  type: "text/plain",
                        lastModified: 0} );

    // ファイルデータをBase64でエンコードして、submit_dataにセットする
    const base64file  = await toBase64(fileData);
    const _submitdata = JSON.stringify( {
                                          line_count: null,
                                          text: base64file,
                                        } )
    setSubmitData( _submitdata );
  }

  const handleSubmitData = async() => {
    axios({
      method: 'post',
      url:    'https://a5gc3ic102.execute-api.ap-northeast-1.amazonaws.com/default/axiosFunction',
      data:   submitData,
    })
    .then(res => {
      console.log(res)
    })
    .catch(results => {
      console.log(results);
    });
  }

  return (
    <div>
      <p>テキストを入力</p>
      <input type="text" onChange={handleChange}></input>
      <p>text: { rawData }</p>
      <button type="button"
                onClick={handleSubmitData}
            >submit</button>
    </div>
  );
};

export default PostTxtFile;

const fileToBase64 = async (file: File) => {
    return new Promise(resolve => {
      const reader = new FileReader();
  
      // Read file content on file loaded event
      reader.onload = (event: any) => {
        resolve(event.target.result);
      };
      
      // Convert data to base64 
      reader.readAsDataURL(file);
    });
};

const toBase64 = async (file: File) => {
    return fileToBase64(file).then((result: any) => {
      return result;
    });
}