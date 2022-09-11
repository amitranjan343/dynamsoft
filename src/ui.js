import './App.css';
import React from 'react';
import Dynamsoft from 'dwt';
import { Button, Typography, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, FormLabel, RadioGroup, Radio } from "@mui/material";

export default class Ui extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            software: '',
            resolution: '',
            pixelType: '',
            showUI : false,
            autofeeder: false,
            scanners: []
        }
        this.saveAll = this.saveAll.bind(this)
        this.removeAll = this.removeAll.bind(this)
        this.removeBlank = this.removeBlank.bind(this)
        this.saveEach = this.saveEach.bind(this)
    }

    DWObject = null;
    containerId = 'dwtcontrolContainer';
    componentDidMount() {
        Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', () => {
            this.Dynamsoft_OnReady()
        });
        Dynamsoft.DWT.ProductKey = 't01519gIAAF1TjhpYquxfLVLUE7H9kFq6MQPc318aqoAV6CE4Hv4FmnF9h24QyvSwR+lBARYI9YWWrz9GJBsn5pJRqNJiwkFGem6IicHqor8q2acEwyfYHOgAiEWOwG/5Ajd9/51VCIAZ0AR4N36A85CfXnESMgJmQBNwHjKASSe7PVO522kfIWUKmAFNwAgZQCWrrNIfZV6Z5Q==';
        Dynamsoft.DWT.ResourcesPath = "/dwt-resources";
        Dynamsoft.DWT.Containers = [{
            WebTwainId: 'dwtObject',
            ContainerId: this.containerId,
            Width: '925px',
            Height: '650px'
        }];
        Dynamsoft.DWT.Load();
        //console.log(this.DWObject)
        if (this.DWObject) {
            let vCount = this.DWObject.SourceCount;
            let sourceNames = [];
            for (let i = 0; i < vCount; i++)
                sourceNames.push(this.DWObject.GetSourceNameItems(i));
            this.setState({ scanners: sourceNames });
        }
    }
    Dynamsoft_OnReady() {
        this.DWObject = Dynamsoft.DWT.GetWebTwain(this.containerId);
        this.DWObject.Viewer.setViewMode(2, 2);
    }
    saveAll() {
        this.DWObject.AcquireImage({
            IfShowUI: this.state.showUI,
            IfFeederEnabled: this.state.autofeeder,
            PixelType: this.state.pixelType,
            Resolution: this.state.resolution,
        });
        this.DWObject.SaveAllAsPDF("dynamsoft.pdf")
    }

    saveEach() {
        this.DWObject.AcquireImage({
            IfShowUI: this.state.showUI,
            IfFeederEnabled: this.state.autofeeder,
            PixelType: this.state.pixelType,
            Resolution: this.state.resolution,
        });
        let count = this.DWObject.HowManyImagesInBuffer
        for (let ii = 0 ; ii < count ; ii++) {
            let fname = "dynamsoft_" + ii.toString() + ".pdf"
            this.DWObject.SaveAsPDF(fname, ii)
        }
    }

    removeAll() {
        this.DWObject.RemoveAllImages();
    }

    removeBlank() {
        let count = this.DWObject.HowManyImagesInBuffer
        let blank_images = []
        for (let ii = 0 ; ii < count ; ii++) {
            if (this.DWObject.IsBlankImage(ii)) {
                blank_images.push(ii)
            }
        }
        this.DWObject.SelectImages(blank_images)
        this.DWObject.RemoveAllSelectedImages()
    }

    render () {
    return (
        <div>
            <div id="viewer" className="inline">
                <div id = {this.containerId}> </div> 
            </div>
            <div id="options" className="inline">
                <Typography variant='h4'>Select Sources:</Typography>
                <FormControl fullWidth size='small'>
                    <InputLabel>select</InputLabel>
                    <Select tabIndex="1" value={this.state.scanners[0]} className="fullWidth" onChange={(e) => this.setState({software : e.target.value})}>
                        {
                            this.state.scanners.length > 0 ?
                                this.state.scanners.map((_name, _index) =>
                                    <MenuItem value={_name} key={_index}>{_name}</MenuItem>
                                )
                                :
                                <MenuItem value="noscanner">Looking for devices..</MenuItem>
                        }
                    </Select>
                </FormControl>
                <br/>
                <FormControlLabel control={<Checkbox onChange={(e) => this.setState({showUI : e.target.checked})}/> }
                    label="Show UI"
                />
                <FormControlLabel control={<Checkbox onChange={(e) => this.setState({autofeeder : e.target.checked})} /> }
                    label="AutoFeeder"
                />
                <br/><br />
                <FormControl>
                    <FormLabel>Pixel Type:</FormLabel>
                    <RadioGroup onChange={(e) => this.setState({pixelType : e.target.value})}>
                        <FormControlLabel value="0" control={<Radio />} label="Black & White" />
                        <FormControlLabel value="1" control={<Radio />} label="Gray" />
                        <FormControlLabel value="2" control={<Radio />} label="Color" />
                    </RadioGroup>
                </FormControl>
                <br/>
                <p>Resolution:</p>
                <FormControl fullWidth size='small'>
                    <InputLabel>select</InputLabel>
                    <Select
                        value={this.state.resolution}
                        label="select"
                        onChange={(e) => this.setState({resolution : e.target.value})}
                    >
                        <MenuItem value={90}>100</MenuItem>
                        <MenuItem value={90}>90</MenuItem>
                        <MenuItem value={80}>80</MenuItem>
                        <MenuItem value={70}>70</MenuItem>
                        <MenuItem value={60}>60</MenuItem>
                    </Select>
                </FormControl><br/><br/>
                <Button sx={{my:1}} variant='outlined' onClick={this.saveAll}>Scan and Save 1</Button><br />
                <Button sx={{my:1}} variant='outlined' onClick={this.saveEach}>Scan and Save 2</Button><br />
                <Button sx={{my:1}} variant='outlined' onClick={this.removeBlank}>Remove Blank Images</Button><br />
                <Button sx={{my:1}} variant='outlined' onClick={this.removeAll}>Remove all Images</Button>
            </div>
        </div>
    )}
}