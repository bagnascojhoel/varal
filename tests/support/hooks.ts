import { After, Before, setWorldConstructor } from '@cucumber/cucumber';
import { TestWorld } from './world';

setWorldConstructor(TestWorld);

Before(function (this: TestWorld) {
  this.setupContainer();
});

After(function (this: TestWorld) {
  this.reset();
});
