using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using api.Data;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class QuizController : ControllerBase
    {


        private readonly ILogger<QuizController> _logger;
        private readonly QuizzerDbContext _context;

        public QuizController(ILogger<QuizController> logger, QuizzerDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet()]
        public IEnumerable<Quiz> GetList()
        {
            return _context.Quizzes.ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<Quiz> Get(string id)
        {
            return _context.Quizzes.FirstOrDefault(x => x.Id == Guid.Parse(id));
        }

        [Permission("content:write")]
        [HttpPost()]
        public ActionResult<Quiz> Post(Quiz questionSet)
        {
            _context.Quizzes.Add(questionSet);
            _context.SaveChanges();
            return questionSet;
        }


        [Permission("content:write")]
        [HttpPatch("{id}")]
        public ActionResult<Quiz> Patch(string id, Quiz questionSet)
        {

            var entity = _context.Quizzes.Find(Guid.Parse(id));
            _context.Entry(entity).CurrentValues.SetValues(questionSet);
            _context.Update(entity);
            _context.SaveChanges();
            return entity;
        }

        [Permission("content:delete")]
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var entity = _context.Quizzes.Find(Guid.Parse(id));
            _context.Remove(entity);
            _context.SaveChanges();
            return StatusCode(200, "success");
        }

    }
}
