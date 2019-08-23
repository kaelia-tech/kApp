// Page models
import * as pages from './page-models'

fixture`Basic`// declare the fixture
  .page`${pages.getUrl()}` // specify the start page
  // test.before/test.after overrides fixture.beforeEach/fixture.afterEach hook,
  // so implement one in your test if you'd like another behaviour
  .beforeEach(async test => {
    // mock geolocation
    await pages.mockLocationAPI()
  })
  .afterEach(async test => {
    // check for console error messages
    await pages.checkNoClientError(test)
  })

const app = new pages.ApplicationLayout()
const auth = new pages.Authentication()
const docs = new pages.Documents()

test('Login as default user', async test => {
  await auth.logIn(test, { email: 'kalisio@kalisio.xyz', password: 'Pass;word1' })
  await docs.create(test, { name: 'document1' })
  await docs.delete(test)
  await auth.logOut(test)
})
