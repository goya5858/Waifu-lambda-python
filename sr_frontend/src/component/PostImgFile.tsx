import axios from 'axios';
import {ChangeEvent, useState, useEffect} from "react";

const PostImgFile = () => {
  const [submitData, setSubmitData]  = useState<string>();
  const [imgURL,     setImgURL]      = useState<string>();
  const [replyImgURL,setReplyImgURL] = useState<string>();

  useEffect( ()=>{
    console.log("IMG Loaded")
  }, [submitData] );

  // Inputが変更されるたびに表示&提出用のデータを更新
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const _rawdata: File = e.target.files[0] //提出する生データ
    const imgURL:string  = URL.createObjectURL(e.target.files[0]);
    setImgURL( imgURL ); //読み込んだ画像を表示
    setReplyImgURL( "" );

    // ファイルデータをBase64でエンコードして、submit_dataにセットする
    if (!_rawdata) return ; 
    const base64file  = await toBase64(_rawdata);
    const _submitdata = JSON.stringify( {
                  line_count: "pass",
                  text: base64file,
                } )
    setSubmitData( _submitdata );
  }

  const handleSubmitData = async() => {
    if (!submitData) return ;
    axios( {
             method: 'post',
             url:    'https://txsei0q801.execute-api.ap-northeast-1.amazonaws.com/default/axiosFunction2',
             //url: 'https://0pc9jzuqyl.execute-api.ap-northeast-1.amazonaws.com/default/goLambdaFunction' ,
             data:   submitData,
          } )
    .then( res => {
            console.log(res)
            let new_Img:File      = createJpegFile4Base64( res.data, "new_img" )
            let newImgURL:string  = URL.createObjectURL( new_Img );
            setReplyImgURL( newImgURL );
            console.log(new_Img);
          } )
    .catch(results => {
      console.log(results);
    });
  }

  const downloadImg = () => {
    if (!replyImgURL) return;
    const dLink    = document.createElement("a"); // ダウンロード用のエレメント作成
    dLink.href     = replyImgURL; //作成したエレメントにURIを設置
    dLink.download = new Date().getTime() + ".jpg"; //DLするファイルの名前を設定
    dLink.click();
    dLink.remove();
  }

  return (
    <div className='container'>
      <div className='title'>画像</div>
      <input type    ="file" 
             name    ="example" 
             accept  ="image/*" 
             onChange={handleChange}
      />
      <div className='images'>
        <img src={ imgURL }      alt="" className="submit-img" />
        <img src={ replyImgURL } alt="" className="return-img" />
      </div>
      <div className='buttons'>
        <button type   ="button"
                onClick={handleSubmitData}
               >submit</button>
        <button type   ="button"
                onClick={downloadImg}
               >download</button>
      </div>
      
    </div>
  );
};

export default PostImgFile;

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

const createJpegFile4Base64 = function (base64: string, name: string) {
  // base64のデコード
  const bin = atob(base64.replace(/^.*,/, ''));
  // バイナリデータ化
  const buffer = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i);
  }
  // ファイルオブジェクト生成(この例ではjpegファイル)
  return new File([buffer.buffer], name, {type: "image/jpg"});
};