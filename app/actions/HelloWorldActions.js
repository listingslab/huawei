import alt from 'flux/alt';

class HelloWorld {

	/**
	 * Increment the HelloWorld click count
	 *
	 * @param  { }
	 * @return { }
	 */
	incrementHelloWorld() {
		window.setTimeout(()=>{
			this.dispatch();
		}, 30);
	}

}

export default alt.createActions(HelloWorld);
