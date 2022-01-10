import axios from 'axios';
import {ChangeEvent, useState} from "react";

const PostTxt = () => {
  const [textData, setTextData] = useState<string>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log( typeof e.target.value );
    //console.log( e.target.files );
    setTextData( e.target.value );
  }

  const handleSubmitData = async() => {
    axios({
      method: 'post',
      url:'https://a5gc3ic102.execute-api.ap-northeast-1.amazonaws.com/default/axiosFunction',
      data: {
        line_count: null,
        text: textData,
      },
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
      <p>text: { textData }</p>
      <button type="button"
                onClick={handleSubmitData}
            >submit</button>
    </div>
  );
};

export default PostTxt;