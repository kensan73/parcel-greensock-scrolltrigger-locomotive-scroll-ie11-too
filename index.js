import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';

gsap.registerPlugin(ScrollTrigger);
//watch the free video on how this demo was made
// https://www.snorkl.tv/scrolltrigger-smooth-scroll/


const locoScroll = new LocomotiveScroll({
  el: document.querySelector(".scrollContainer"),
  smooth: true
});

// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)



locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy(".scrollContainer", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : 		locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector(".scrollContainer").style.transform ? "transform" : "fixed"
});

let master = gsap.timeline({defaults:{ease:"none"}});

let circletl = gsap.timeline({defaults:{ease:"none"}})
  .fromTo('#circleSvg', {scale: 12}, {scale: .25, duration: 6, ease: 'power4'})
  .fromTo('#textInsideCircle', {attr: {opacity: 1}}, {attr: {opacity: 0, duration: 6}}, '<')
  .fromTo('#image1', {attr: {opacity: 1}}, {attr: {opacity: 0}}, "+=4")
  .fromTo('#image2', {attr: {opacity: 0}}, {attr: {opacity: 1}}, '<')

let lefttl = gsap.timeline({defaults:{ease:"none"}})
  .fromTo('.circleContainer .leftContent', {
    opacity: 0,
    top: '400px',
    visibility: 'hidden',
  }, {
    opacity: 1,
    duration: 6,
    top: '0',
    ease: 'power4',
    delay: '-.5',
    visibility: 'visible',
  })
  .fromTo('.circleContainer .leftContent', {
    opacity: 1,
    top: '0',
    visibilityZZZ: 'visible',
  }, {
    opacity: 0,
    top: '-400px',
    visibilityZZZ: 'hidden',
    duration: 6,
    ease: 'power4'
  })

let righttl = gsap.timeline({defaults:{ease:"none"}})
  .fromTo('.circleContainer .rightContent', {
    opacity: 0,
    visibility: 'hidden',
    top: '400px',
  }, {
    visibility: 'visible',
    opacity: 1,
    top: '0px',
    duration: 6,
    ease: 'power4',
    delay: '-.5'})

master.add(circletl)
master.add(lefttl, 2)
master.add(righttl, 8)

ScrollTrigger.create({
  trigger:".circleContainer",
  start:"center center",
  scroller:".scrollContainer",
  animation: master,
  scrub:3,
  pin:true
})


gsap.set("#bigHand, #smallHand", {svgOrigin:"200 200"})

let tl = gsap.timeline({defaults:{ease:"none"}})
  .to("#bigHand", {rotation:360, duration:3})
  .to("#smallHand", {rotation:30, duration:3}, 0)

ScrollTrigger.create({
  trigger:".clockWrapper",
  start:"50% 50%",
  end:"+=300",
  scroller:".scrollContainer",
  animation:tl,
  scrub:true,
  pin:true
})

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

//watch the free video on how this demo was made
// https://www.snorkl.tv/scrolltrigger-smooth-scroll/