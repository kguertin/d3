// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // add condig
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", 600)
  .attr("height", 600);

// Create margins and dimensions
const MARGIN = {
  top: 20,
  right: 20,
  bottom: 100,
  left: 100,
};
const GRAPH_WIDTH = 600 - MARGIN.left - MARGIN.right;
const GRAPH_HEIGHT = 600 - MARGIN.top - MARGIN.bottom;

const graph = svg
  .append("g")
  .attr("graphWidth", GRAPH_WIDTH)
  .attr("graphHeight", GRAPH_HEIGHT)
  .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

const xAxisGroup = graph
  .append("g")
  .attr("transform", `translate(0, ${GRAPH_HEIGHT})`);

const yAxisGroup = graph.append("g");

//scales
const y = d3.scaleLinear().range([GRAPH_HEIGHT, 0]);
const x = d3.scaleBand().range([0, 500]).paddingInner(0.2).paddingOuter(0.2);

// Create the axes
const xAxis = d3.axisBottom(x);
const yAxis = d3
  .axisLeft(y)
  .ticks(3)
  .tickFormat((d) => d + " orders");

// update x-axis text
xAxisGroup
  .selectAll("text")
  .attr("transform", "rotate(-40)")
  .attr("text-anchor", "end")
  .attr("fill", "orange");

const update = (data) => {
  // Update scale domains
  y.domain([0, d3.max(data, (d) => d.orders)]);
  x.domain(data.map((i) => i.name));

  // bind data to elements
  const rects = graph.selectAll("rect").data(data);

  // remove unused elements
  rects.exit().remove();

  // update elements in the DOM
  rects
    .attr("width", x.bandwidth)
    .attr("height", (d) => y(d.orders))
    .attr("fill", "orange")
    .attr("x", (d) => x(d.name))
    .attr("y", (d) => y(d.orders));

  // create elemetns from enter nodes
  rects
    .enter()
    .append("rect")
    .attr("width", x.bandwidth)
    .attr("height", (d) => GRAPH_HEIGHT - y(d.orders))
    .attr("fill", "orange")
    .attr("x", (d) => x(d.name))
    .attr("y", (d) => y(d.orders));

  // Call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

const q = query(collection(db, "dishes"));

getDocs(q).then(({ docs }) => {
  const data = docs.map((doc) => doc.data());
  update(data);
});
