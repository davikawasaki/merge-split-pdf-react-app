import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Files from 'react-files';
import PDFService from '../../../lib/provider/pdfProvider';
import { saveSync } from 'save-file'


class FilesDragDrop extends Component {
    constructor (props) {
        super(props)
        this.state = {
            files: [],
            hasFiles: false
        }
        this.classes = props.classes
    }

    // state = {
    //   files: [],
    // hasFiles: false
    // }

    onFilesChange = (files) => {
        this.setState({
            files,
            hasFiles: files.length > 0 ? true : false
        }, () => {
            console.log(this.state)
        })

        // this.setState({value: event.target.value}, function () {
        //     console.log(this.state.value);
        // });
    }

    onFilesError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
    }

    filesRemoveOne = (file) => {
        this.state.files.removeFile(file)
    }

    filesRemoveAll = () => {
        this.setState({
            files: [],
            hasFiles: false
        }, () => {
            console.log(this.state)
        })
    }

    startMerge = () => {
        this.setState({
            files: this.state.files,
            hasFiles: false
        }, () => {
            console.log("Starting merge...")
        })

        PDFService.mergeBetweenPDF(this.state.files)
            .then((res) => {
                // console.log(res)
                const fileName = "output_merge_" + new Date().toISOString().replace(":","_").replace("T","_").replace("Z","") + ".pdf"
                saveSync(res, fileName)
                console.log("Merge successfull and downloaded!")
                // FileSaver.saveAs(res, 'foo.pdf')
            })
            .catch((err) => console.log(err))
            .finally(() => this.filesRemoveAll())
    }

    render() {
        return (
            <div className="files">
                <Grid container spacing={32} justify="center">
                    <Grid item className={this.classes.dropFilesGridZone}>
                        <Files
                            className={this.classes.dropFilesZone}
                            onChange={this.onFilesChange}
                            onError={this.onFilesError}
                            accepts={['.pdf']}
                            multiple
                            maxFiles={1000}
                            maxFileSize={10000000}
                            minFileSize={0}
                            clickable
                        >
                            <div className={this.classes.dropFilesZoneDiv}>Drop files here or click to upload</div>
                        </Files>
                    </Grid>
                </Grid>

                <Grid container spacing={32} justify="center">
                    {
                        this.state.files.length > 0
                            ?
                            <Grid item className={this.classes.dropFilesGridZone}>
                                <div className='files-list'>
                                    <ul>{this.state.files.map((file) =>
                                        <li className='files-list-item' key={file.id}>
                                            <div className='files-list-item-content'>
                                                <div className='files-list-item-content-item files-list-item-content-item-1'>{file.name}</div>
                                                <div className='files-list-item-content-item files-list-item-content-item-2'>{file.sizeReadable}</div>
                                            </div>
                                            <div
                                                id={file.id}
                                                className='files-list-item-remove'
                                                onClick={this.filesRemoveOne.bind(this, file)} // eslint-disable-line
                                            />
                                        </li>
                                    )}</ul>
                                </div>
                            </Grid>
                            :
                            <Grid item className={this.classes.dropFilesWarningGridZone}>
                                <div className='files-list'>
                                    No files selected!
                                </div>
                            </Grid>
                    }
                </Grid>

                <Grid container spacing={16} justify="center">
                    <Grid item>
                        <Button variant="contained" color="primary"
                                disabled={!this.state.hasFiles}
                                onClick={this.startMerge}>
                            Start merge
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="secondary" onClick={this.filesRemoveAll}>
                            Clear selection
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const styles = theme => ({
    dropFilesGridZone: {
        width: '70%'
    },
    dropFilesZone: {
        padding: '2em',
        border: '2px dashed rgba(0, 0, 0, .1)',
        color: 'rgba(0, 0, 0, .4)',
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        boxSizing: 'border-box',
        textAlign: 'center'
    },
    dropFilesZoneDiv: {
        width: '100%'
    },
    dropFilesWarningGridZone: {
        width: '70%',
        textAlign: 'center',
        color: 'red',
        fontWeight: 'bold'
    },
});


export default withStyles(styles, { name: 'MuiFilesDragDrop' })(FilesDragDrop);
