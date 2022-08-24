import './App.css';
import React from 'react';
import Dynamsoft from 'dwt';
import { Button, Typography, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, FormLabel, RadioGroup, Radio } from "@mui/material";

export default class Ui extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            software: '',
            resolution: ''
        }
        this.toggleUI = this.toggleUI.bind(this)
    }

    DWObject = null;
    containerId = 'dwtcontrolContainer';
    componentDidMount() {
        Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', () => {
            this.Dynamsoft_OnReady()
        });
        Dynamsoft.DWT.ProductKey = 'YOUR-PRODUCT-KEY';
        Dynamsoft.DWT.ResourcesPath = "/dwt-resources";
        Dynamsoft.DWT.Containers = [{
            WebTwainId: 'dwtObject',
            ContainerId: this.containerId,
            Width: '300px',
            Height: '400px'
        }];
        Dynamsoft.DWT.Load();
    }
    Dynamsoft_OnReady() {
        this.DWObject = Dynamsoft.DWT.GetWebTwain(this.containerId);
    }
    acquireImage() {
        this.DWObject.AcquireImage();
    }

    toggleUI (e) {
        if (e.target.value){
            this.DWObject.Viewer.show();
        }
        else {
            this.DWObject.Viewer.hide();
        }
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
                    <Select
                        value={this.state.software}
                        label="select"
                        onChange={(e) => this.setState({software : e.target.value})}
                    >
                        <MenuItem value={"TWAIN2 FreeImage Software"}>TWAIN2 FreeImage Software</MenuItem>
                    </Select>
                </FormControl>
                <br/>
                <FormControlLabel control={<Checkbox onchange={this.toggleUI}/> }
                    label="Show UI"
                />
                <FormControlLabel control={<Checkbox /> }
                    label="AutoFeeder"
                />
                <br/><br />
                <FormControl>
                    <FormLabel>Pixel Type:</FormLabel>
                    <RadioGroup>
                        <FormControlLabel value="Black & White" control={<Radio />} label="Black & White" />
                        <FormControlLabel value="Gray" control={<Radio />} label="Gray" />
                        <FormControlLabel value="Color" control={<Radio />} label="Color" />
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
                <Button sx={{my:1}} variant='outlined' onClick={this.acquireImage}>Scan and Save 1</Button><br />
                <Button sx={{my:1}} variant='outlined' onClick={this.acquireImage}>Scan and Save 2</Button><br />
                <Button sx={{my:1}} variant='outlined'>Remove Blank Images</Button><br />
                <Button sx={{my:1}} variant='outlined'>Remove all Images</Button>
            </div>
        </div>
    )}
}