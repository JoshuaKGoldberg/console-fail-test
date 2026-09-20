it("passes when only allowed console methods are called", () => {
	console.warn("This is allowed.");

	// Uncomment this line to make the test fail:
	// console.log("Whoops!");
});
