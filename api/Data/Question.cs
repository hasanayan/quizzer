using System;
using System.Collections.Generic;
using JsonSubTypes;
using Newtonsoft.Json;

namespace api.Data
{
    [JsonConverter(typeof(JsonSubtypes), "Type")]
    [JsonSubtypes.KnownSubType(typeof(StringAnswerQuestion), QuestionType.STRING_ANSWER)]
    [JsonSubtypes.KnownSubType(typeof(MultipleChoiceQuestion), QuestionType.MULTIPLE_CHOICE)]
    [JsonSubtypes.KnownSubType(typeof(SingleChoiceQuestion), QuestionType.SINGLE_CHOICE)]

    public abstract class Question
    {
        public string Title { get; set; }

        public QuestionType Type { get; set; }

        public Guid Id { get; set; }

        public Question()
        {
            Id = Guid.NewGuid();
        }

    }


    public enum QuestionType
    {
        STRING_ANSWER = 0,
        SINGLE_CHOICE = 1,
        MULTIPLE_CHOICE = 2
    }

    public class StringAnswerQuestion : Question
    {
        public string Answer { get; set; }
        public StringAnswerQuestion() : base()
        {
            Type = QuestionType.STRING_ANSWER;
        }

    }

    public class SingleChoiceQuestion : Question
    {
        public string Answer { get; set; }
        public ICollection<QuestionOption> Options { get; set; }
        public SingleChoiceQuestion() : base()
        {
            Type = QuestionType.SINGLE_CHOICE;
            Options = new List<QuestionOption>();
        }

    }

    public class MultipleChoiceQuestion : Question
    {
        public ICollection<string> Answer { get; set; }

        public ICollection<QuestionOption> Options { get; set; }

        public MultipleChoiceQuestion() : base()
        {
            Type = QuestionType.MULTIPLE_CHOICE;
            Answer = new List<string>();
            Options = new List<QuestionOption>();
        }

    }

    public class QuestionOption
    {
        public string Label { get; set; }
        public string Value { get; set; }

    }



}