import React, {useEffect, useState} from 'react';
import { useAuth } from './../../firebase/auth';
import axios from 'axios';

export default function PictureEm() {
    
    const [src, setSrc] = useState('');
    const [waste, setWaste] = useState('');
    const [carbon, setCarbon] = useState(0);

    function imgUpload(event) {
        try {
            setSrc(URL.createObjectURL(event.target.files[0]));
        } catch(err) {
            console.log(err);
        }
        try {
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var img = new Image();

            img.onload = function() {
                var height = img.height;
                var width = img.width;
                canvas.height = height;
                canvas.width = width;
                ctx.drawImage(img, 0, 0);
            }

            img.src = URL.createObjectURL(event.target.files[0]);
            
        } catch(err) {
            console.log(err);
        }
        
    }

    function calcEm() {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        console.log(imgData);
        let data = {img: imgData, height: canvas.height, width: canvas.width};
        console.log(data);
        axios.post('http://localhost:8080/img', data)
            .then(res => {
                console.log(res.data.data);
                setCarbon(res.data.data.carbon);
                setWaste(res.data.data.item);
            })
            .catch(err => console.log(err));
    }

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            setIsLoggedIn(true);
        }
    }, []);

    function saveEm() {
        let data = {
            uid: currentUser.uid,
            waste: carbon,
            total: Number(carbon)
        }
        axios.post('http://localhost:8080/daily', data)
            .then(response => console.log(response))
            .catch(err => console.log('error --> ', err));
    }

    return (
        <div className='transparent'>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <form>
                                <input type="file"  accept="image/*" name="image" id="file" onInput={imgUpload} />
                                <br/>
                                <p>{src}</p>
                                <br/>
                                <canvas id='canvas' height={0} width={0}></canvas>
                                <br/>
                                <button type="button" onClick={calcEm} className='submit-btn'>Find Emission</button>              
                            </form>
                        </td>
                        <td style={{width:'30%',}}>
                            <h4>Your emissions</h4>
                            <p>Object: {waste}</p>
                            <h6>Carbon emission: {carbon} kgs</h6>
                            {isLoggedIn && <button className='submit-btn' onClick={saveEm}>Save emissions</button>}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
};