import Router from 'koa-router';
import catStore from './store';

export const router = new Router();

router.get('/', async (ctx) => {
  console.log(new Date(), "get all");
  const response = ctx.response;
  response.body = await catStore.find({});
  response.status = 200; // ok
});

router.post('/paginated', async (ctx) => {
  console.log(new Date(), "paginated");
  const body = ctx.request.body;
  const response = ctx.response;
  response.body = await catStore.getAllPaginated({}, body.start, body.limit);
  response.status = 200; // ok
});

router.get('/count', async (ctx) => {
  console.log(new Date(), "count");
  const response = ctx.response;
  const allData = await catStore.find({});
  const returnCounts = {};
  allData.forEach((item) => {
    if(returnCounts[item.size]) {
      returnCounts[item.size] = returnCounts[item.size] + 1;
    } else {
      returnCounts[item.size] = 1;
    }
  });
  response.body = returnCounts;
  response.status = 200; // ok
});

router.get('/:id', async (ctx) => {
  const note = await catStore.findOne({ _id: ctx.params.id });
  const response = ctx.response;
  if (note) {
    response.body = note;
    response.status = 200; // ok
  } else {
    response.status = 404; // not found
  }
});

const createCat = async (cat, response) => {
  try {
    response.body = await catStore.insert(cat);
    response.status = 201; // created
  } catch (err) {
    response.body = { issue: [{ error: err.message }] };
    response.status = 400; // bad request
  }
};

router.post('/', async (ctx) => await createCat(ctx.request.body, ctx.response));

router.put('/:id', async (ctx) => {
  const cat = ctx.request.body;
  const id = ctx.params.id;
  const catId = cat._id;
  const response = ctx.response;
  if (catId && catId !== id) {
    response.body = { issue: [{ error: 'Param id and body _id should be the same' }] };
    response.status = 400; // bad request
    return;
  }
  if (!id) {
    await createCat(cat, response);
  } else {
    const updatedCount = await catStore.update({ _id: id }, cat);
    if (updatedCount === 1) {
      response.body = cat;
      response.status = 200; // ok
    } else {
      response.body = { issue: [{ error: 'Resource no longer exists' }] };
      response.status = 405; // method not allowed
    }
  }
});

router.del('/:id', async (ctx) => {
  await catStore.remove({ _id: ctx.params.id });
  ctx.response.status = 204; // no content
});
