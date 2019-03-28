import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {

    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
	textAlign: 'center'
  },
});

class ModalLoadingAlert extends React.Component {
	constructor (props) {
        super(props)
        this.state = {
            open: props.isOpen ? props.isOpen : false,
			loading: props.isLoading,
    		modalQuery: 'idle',
			msg: props.msg,
			respMsg: null
        }
		this.filesClearAndRemoveAll = props.clearModalStatus
    }

	componentWillReceiveProps(nextProps) {
		// You don't have to do this check first, but it can help prevent an unneeded render
		// if (nextProps.startTime !== this.state.startTime) {
		//   this.setState({ startTime: nextProps.startTime });
		// }
		if (nextProps.hasOwnProperty("isOpen") && nextProps.hasOwnProperty("isLoading") && nextProps.hasOwnProperty("msg")) {
			// console.log(nextProps)
			if (nextProps.isOpen) this.handleOpen()
			// else this.handleClose()

			if (nextProps.isLoading) this.handleLoadingProgress()
			else {
				if (nextProps.msg.err != null) this.handleResponseProgress('error', nextProps.msg.err)
				else if (nextProps.msg.success != null) this.handleResponseProgress('success', nextProps.msg.success)
			}
		}
	}

	handleOpen = () => {
		this.setState({ open: true });
	}

	handleClose = () => {
		this.setState({ open: false });
	}

	handleCloseAfterUpload = () => {
		this.setState({ open: false, loading: false, modalQuery: 'idle', msg: { err: null, success: null }, respMsg: null });
		this.filesClearAndRemoveAll()
	}

	handleLoadingProgress = () => {
		this.setState({ loading: true, modalQuery: 'progress' });
	}

	handleResponseProgress = (type, msg) => {
		this.setState({ loading: false, modalQuery: type, respMsg: msg });
	}

	handleIdleProgress = () => {
		this.setState({ loading: false, modalQuery: 'idle' });
	}

	render() {
		const { classes } = this.props;

		return (
		  <div>
		    <Modal
			  disableBackdropClick
			  disableEscapeKeyDown
		      aria-labelledby="simple-modal-title"
		      aria-describedby="simple-modal-description"
		      open={this.state.open}
		      onClose={this.handleClose}
		    >
			      	<div style={getModalStyle()} className={classes.paper}>
				  	{
						this.state.modalQuery !== 'progress' ? (
							<Grid container spacing={32} justify="center">
								<Grid item>
									<Typography>{this.state.respMsg}</Typography>
								</Grid>
						        <Grid item>
									<Button variant="contained" color="primary"
										onClick={this.handleCloseAfterUpload}>
										New merge
									</Button>
						        </Grid>
					        </Grid>
						) : (
						  	<div>
								<Fade
									in={this.state.modalQuery === 'progress'}
									style={{
									  transitionDelay: this.state.modalQuery === 'progress' ? '800ms' : '0ms',
									}}
									unmountOnExit
								>
									<CircularProgress />
								</Fade>
								<Typography>Merging...</Typography>
							</div>
						)
					}

			        <ModalLoadingAlertWrapped />
		      	</div>
		    </Modal>
		  </div>
		);
	}
}

// We need an intermediary variable for handling the recursive nesting.
const ModalLoadingAlertWrapped = withStyles(styles)(ModalLoadingAlert);

export default ModalLoadingAlertWrapped;
