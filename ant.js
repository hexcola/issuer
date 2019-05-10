/**
 * issue ant will extract out issues & comments from a specific repository.
 */

// built-in
const fs = require('fs');
const path = require('path');

// npm pakcages
const yaml = require('js-yaml')
const Octokit = require('@octokit/rest');

//
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));

const issueSavePath = path.resolve(__dirname, config.output, 'issues');
const commentSavePath = path.resolve(__dirname, config.output, 'comments');

console.log(config.token);

const github = new Octokit({
  auth: `token ${config.token}`,
  userAgent: 'octokit/rest.js v1.2.3',
  previews: [],
  baseUrl: 'https://api.github.com',
  log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error
  },
  request: {
    agent: undefined,
    timeout: 0
  }
});

/**
 * 获取 issues
 * @param { Number } page 哪一页 
 * @param { Number } per_page 每页多少条记录
 * @returns Promise
 */
async function fetchIssues(page, per_page = 100){
    console.log(page);
    const { data, status, url } = await github.issues.listForRepo({ 
        owner: config.owner,
        repo: config.repo,
        state: config.state,
        page, per_page
    });

    if(status !== 200) {
        const error = new Error( `Oops! something wrong when fetch ${url}`);
        return error;
    }
    
    if(data.length != 0) {
        data.forEach((issue) =>{
            const fileName = `${issue.number}.json`;
            const savePath = path.resolve(issueSavePath, fileName);
            fs.writeFile(savePath, JSON.stringify(issue), (err) => {
                if(err) { console.error(`[FAIL] ${err}`); }
            });
            console.log(`[OK] issue ${issue.number} saved.`)
        });

        // go fetch next.
        page+=1;
        await fetchIssues(page);
    } else {
        console.log('fetch all issues successfully.')
    }
}

/**
 * 
 * @param { Number } issue_number 获取哪个 issue 的 comment
 * @returns Promise
 */
async function fetchComments(issue_number, page, per_page = 100){
    const { data, status, url} = await github.issues.listComments({
        owner: config.owner,
        repo: config.repo,
        issue_number,
        page,
        per_page
    });

    if(status !== 200) {
        const error = new Error( `Oops! something wrong when fetch ${url}`);
        return error;
    }


    const fileName = `${issue_number}-${page}.json`;
    const savePath = path.resolve(commentSavePath, fileName);
    fs.writeFile(savePath, JSON.stringify(data), (err) => {
        if(err) { console.error(`[FAIL] ${err}`); }
    });
    console.log(`[OK] comments of issue ${issue_number} saved.`)

    if(data.length >= 100) {
        // go fetch next.
        page+=1;
        await fetchComments(issue_number, page);
    }
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array);
    }
  }

async function main() {
    // 定义从哪一页开始
    let page = 0;
    // extract issues 100 result per pages
    console.log('>>>>> start download issues');
    await fetchIssues(page);
    console.log('>>>>> all issues fetched');

    console.log('>>>>> fetched all comments based on issues');
    const issueFiles = fs.readdirSync(issueSavePath);
    await asyncForEach(issueFiles, async(issueFile) => {
        const issue_number = parseInt(issueFile.split('.')[0]);
        await fetchComments(issue_number, 0);
        // await sleep(300);
    })
    console.log('done.')
}

// Let's start
main();

